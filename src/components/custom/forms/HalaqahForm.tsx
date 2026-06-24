import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSpinner, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { muhafizService } from "@/features/muhafiz/api/muhafizService";
import { halaqahManagementService } from "@/features/halaqah/api/halaqahManagementService";
import { sesiService } from "@/features/halaqah/api/sesiService";
import { type Halaqah } from "@/features/halaqah/types";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";
import { getErrorMessage } from "@/utils/error";
import { type Muhafiz } from "@/features/muhafiz/types";
import { Checkbox } from "@/components/ui/checkbox";

const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  id_muhafiz: z.number().min(1, "Pilih muhafiz"),
  id_sesis: z.array(z.number()).optional(),
});

type HalaqahFormValues = z.infer<typeof halaqahSchema>;

interface HalaqahFormProps {
  initialData?: {
    id_halaqah?: number;
    name_halaqah: string;
    id_muhafiz: number;
    sesi_halaqahs?: Array<{ id_sesi: number; nama_sesi: string }>;
  };
  onSuccess?: () => void;
}

export function HalaqahForm({ initialData, onSuccess }: HalaqahFormProps) {
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  const [existingHalaqahs, setExistingHalaqahs] = useState<Halaqah[]>([]);
  const [sesiList, setSesiList] = useState<SesiHalaqah[]>([]);
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
      id_muhafiz: initialData?.id_muhafiz || 0,
      id_sesis: initialData?.sesi_halaqahs?.map(s => s.id_sesi) || [],
    },
  });

  const selectedMuhafizId = watch("id_muhafiz");

  // Load muhafiz dan halaqah yang sudah ada untuk pengecekan "availability"
  useEffect(() => {
    const loadRequiredData = async () => {
      try {
        const [mList, hList, sList] = await Promise.all([
          muhafizService.getAllMuhafiz(),
          halaqahManagementService.getAllHalaqah(),
          sesiService.getSesiHalaqah(),
        ]);
        setMuhafizList(mList);
        setExistingHalaqahs(hList);
        setSesiList(sList.data || []);
      } catch (err) {
        console.error("Gagal mengambil data pendukung:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadRequiredData();
  }, []);

  // Filter Muhafidz: Hanya tampilkan yang belum punya halaqah
  // KECUALI muhafidz yang memang sedang dipilih saat ini (untuk mode Edit)
  const availableMuhafiz = useMemo(() => {
    // Cari ID Muhafidz yang sudah terpakai
    const takenMuhafizIds = existingHalaqahs.map((h) => h.id_muhafiz);

    return muhafizList.filter((m) => {
      const isCurrentMuhafiz = m.id_user === initialData?.id_muhafiz;
      const isTaken = takenMuhafizIds.includes(m.id_user);

      // Munculkan jika: Belum diambil orang lain ATAU dia adalah muhafidz halaqah ini sendiri
      return !isTaken || isCurrentMuhafiz;
    });
  }, [muhafizList, existingHalaqahs, initialData]);

  const onSubmit = async (data: HalaqahFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (initialData?.id_halaqah) {
        await halaqahManagementService.updateHalaqah(initialData.id_halaqah, {
          name_halaqah: data.name_halaqah,
          id_muhafiz: data.id_muhafiz,
          id_sesis: data.id_sesis,
        });
      } else {
        await halaqahManagementService.createHalaqah({
          name_halaqah: data.name_halaqah,
          id_muhafiz: data.id_muhafiz,
          id_sesis: data.id_sesis,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menyimpan halaqah"));
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
            {initialData ? "Halaqah diperbarui!" : "Halaqah berhasil dibuat!"}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name_halaqah">Nama Halaqah</Label>
        <Input
          id="name_halaqah"
          {...register("name_halaqah")}
          placeholder="Contoh: Halaqah Al-Furqan"
          disabled={isSubmitting}
        />
        {errors.name_halaqah && (
          <p className="text-sm text-destructive">{errors.name_halaqah.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="id_muhafiz">Muhafiz Pengampu</Label>
        <Select
          disabled={isLoadingData || isSubmitting}
          value={selectedMuhafizId !== 0 ? selectedMuhafizId.toString() : undefined}
          onValueChange={(value) => setValue("id_muhafiz", parseInt(value), { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingData ? "Memuat data..." : "Pilih muhafiz yang tersedia"} />
          </SelectTrigger>
          <SelectContent>
            {availableMuhafiz.length === 0 && !isLoadingData ? (
              <div className="p-2 text-sm text-center text-muted-foreground">
                Tidak ada muhafiz yang tersedia
              </div>
            ) : (
              availableMuhafiz.map((m) => (
                <SelectItem key={m.id_user} value={m.id_user.toString()}>
                  {m.name} ({m.email})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.id_muhafiz && (
          <p className="text-sm text-destructive">{errors.id_muhafiz.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Pilih Sesi Halaqah (Opsional)</Label>
        {isLoadingData ? (
          <div className="text-sm text-muted-foreground p-3 border rounded-md">Memuat sesi...</div>
        ) : sesiList.length === 0 ? (
          <div className="text-sm text-muted-foreground p-3 border rounded-md text-center">
            Belum ada sesi halaqah yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto bg-muted/20">
            {sesiList.map((sesi) => (
              <div key={sesi.id_sesi} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 bg-background shadow-sm">
                <Checkbox
                  checked={watch("id_sesis")?.includes(sesi.id_sesi) || false}
                  onCheckedChange={(checked) => {
                    const current = watch("id_sesis") || [];
                    if (checked) {
                      setValue("id_sesis", [...current, sesi.id_sesi]);
                    } else {
                      setValue("id_sesis", current.filter(id => id !== sesi.id_sesi));
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

      <Button type="submit" className="w-full" disabled={isSubmitting || isLoadingData}>
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
