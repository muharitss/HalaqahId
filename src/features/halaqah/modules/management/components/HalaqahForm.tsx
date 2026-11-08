import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSpinner, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { halaqahManagementService } from "@/features/halaqah/api/halaqahManagementService";
import { halaqahApi } from "@/features/halaqah/api/halaqah.api";
import { sesiService } from "@/features/halaqah/api/sesiService";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";
import { getErrorMessage } from "@/utils/error";
import { Checkbox } from "@/components/ui/checkbox";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";
import { HalaqahMuhafizManager, type ManagedMuhafiz } from "@/features/halaqah/components";
import { PeranMuhafiz } from "@/types/domain/enums";
import type { HalaqahMuhafizItem } from "@/types";

const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  id_sesis: z.array(z.number()).optional(),
});

type HalaqahFormValues = z.infer<typeof halaqahSchema>;

interface HalaqahFormProps {
  initialData?: {
    id_halaqah?: number;
    name_halaqah: string;
    id_muhafiz?: number;
    sesi_halaqahs?: Array<{ id_sesi: number; nama_sesi: string }>;
    muhafiz?: { id_user: number; name: string; email: string };
    muhafiz_list?: HalaqahMuhafizItem[];
  };
  onSuccess?: () => void;
}

export function HalaqahForm({ initialData, onSuccess }: HalaqahFormProps) {
  const labelHalaqah = useTerminology("HALAQAH");
  const labelMuhafiz = useTerminology("MUHAFIZ");

  const isEditMode = !!initialData?.id_halaqah;

  const [sesiList, setSesiList] = useState<SesiHalaqah[]>([]);
  const [assignedMuhafiz, setAssignedMuhafiz] = useState<ManagedMuhafiz[]>([]);
  const [muhafizError, setMuhafizError] = useState<string | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HalaqahFormValues>({
    resolver: zodResolver(halaqahSchema),
    defaultValues: {
      name_halaqah: initialData?.name_halaqah || "",
      id_sesis: initialData?.sesi_halaqahs?.map((s) => s.id_sesi) || [],
    },
  });

  // Load sesi halaqah
  useEffect(() => {
    const loadRequiredData = async () => {
      try {
        const sList = await sesiService.getSesiHalaqah();
        setSesiList(sList.data || []);
      } catch (err) {
        console.error("Gagal mengambil data sesi:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadRequiredData();
  }, []);

  const onSubmit = async (data: HalaqahFormValues) => {
    setError(null);
    setMuhafizError(null);

    // Pada mode create, wajib memilih minimal 1 muhafiz
    if (!isEditMode && assignedMuhafiz.length === 0) {
      setMuhafizError(`Wajib memilih minimal 1 ${labelMuhafiz.toLowerCase()} (utama)`);
      return;
    }

    setIsSubmitting(true);

    try {
      if (initialData?.id_halaqah) {
        // Update data dasar halaqah (muhafiz sudah dihandle langsung oleh HalaqahMuhafizManager)
        await halaqahManagementService.updateHalaqah(initialData.id_halaqah, {
          name_halaqah: data.name_halaqah,
          id_sesis: data.id_sesis,
        });
      } else {
        // Tentukan muhafiz utama untuk create
        const primaryMuhafiz =
          assignedMuhafiz.find((m) => m.peran === PeranMuhafiz.UTAMA) || assignedMuhafiz[0];

        const createdRes = await halaqahManagementService.createHalaqah({
          name_halaqah: data.name_halaqah,
          id_muhafiz: primaryMuhafiz.id_user,
          id_sesis: data.id_sesis,
        });

        const newHalaqahId = createdRes?.data?.id_halaqah;

        // Tugaskan muhafiz tambahan (selain muhafiz utama yang sudah otomatis terbuat)
        if (newHalaqahId) {
          const additionalMuhafiz = assignedMuhafiz.filter(
            (m) => m.id_user !== primaryMuhafiz.id_user
          );

          for (const m of additionalMuhafiz) {
            try {
              await halaqahApi.assignMuhafiz(newHalaqahId, {
                id_user: m.id_user,
                peran: m.peran,
              });
            } catch (assignErr) {
              console.error(`Gagal menugaskan muhafiz ${m.id_user}:`, assignErr);
            }
          }
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(getErrorMessage(err, `Gagal menyimpan ${labelHalaqah.toLowerCase()}`));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
          <AlertDescription>
            {initialData ? (
              <><Term code="HALAQAH" /> diperbarui!</>
            ) : (
              <><Term code="HALAQAH" /> berhasil dibuat!</>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name_halaqah">
          Nama <Term code="HALAQAH" />
        </Label>
        <Input
          id="name_halaqah"
          {...register("name_halaqah")}
          placeholder={`Contoh: ${labelHalaqah} Al-Furqan`}
          disabled={isSubmitting}
        />
        {errors.name_halaqah && (
          <p className="text-sm text-destructive">{errors.name_halaqah.message}</p>
        )}
      </div>

      {/* Multi-Muhafiz Section */}
      <div className="space-y-2 border-t pt-3">
        <HalaqahMuhafizManager
          idHalaqah={initialData?.id_halaqah}
          initialMuhafiz={initialData?.muhafiz_list}
          fallbackMuhafiz={initialData?.muhafiz}
          value={!isEditMode ? assignedMuhafiz : undefined}
          onChange={!isEditMode ? setAssignedMuhafiz : undefined}
        />
        {muhafizError && (
          <p className="text-sm text-destructive">{muhafizError}</p>
        )}
      </div>

      {/* Sesi Halaqah Section */}
      <div className="space-y-2 border-t pt-3">
        <Label>
          Pilih Sesi <Term code="HALAQAH" /> (Opsional)
        </Label>
        {isLoadingData ? (
          <div className="text-sm text-muted-foreground p-3 border rounded-md">
            Memuat sesi...
          </div>
        ) : sesiList.length === 0 ? (
          <div className="text-sm text-muted-foreground p-3 border rounded-md text-center">
            Belum ada sesi {labelHalaqah.toLowerCase()} yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto bg-muted/20">
            {sesiList.map((sesi) => (
              <div
                key={sesi.id_sesi}
                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 bg-background shadow-sm"
              >
                <Checkbox
                  checked={watch("id_sesis")?.includes(sesi.id_sesi) || false}
                  onCheckedChange={(checked) => {
                    const current = watch("id_sesis") || [];
                    if (checked) {
                      setValue("id_sesis", [...current, sesi.id_sesi]);
                    } else {
                      setValue("id_sesis", current.filter((id) => id !== sesi.id_sesi));
                    }
                  }}
                />
                <div className="space-y-1 leading-none">
                  <Label className="cursor-pointer font-medium">
                    {sesi.nama_sesi}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {sesi.jam_mulai} - {sesi.jam_selesai}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full mt-4" disabled={isSubmitting || isLoadingData}>
        {isSubmitting ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Menyimpan...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            {initialData ? "Perbarui Halaqah" : "Buat Halaqah"}
          </>
        )}
      </Button>
    </form>
  );
}
