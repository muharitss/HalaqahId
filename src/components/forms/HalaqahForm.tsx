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
import { muhafizService } from "@/features/kepala-muhafidz/kelola-muhafiz/services/muhafizService";
import { halaqahManagementService, type Halaqah } from "@/features/kepala-muhafidz/kelola-halaqah/services/halaqahManagementService";
import { getErrorMessage } from "@/utils/error";
import { type Muhafiz } from "@/features/kepala-muhafidz/kelola-muhafiz/types";

const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  muhafiz_id: z.number().min(1, "Pilih muhafiz"),
});

type HalaqahFormValues = z.infer<typeof halaqahSchema>;

interface HalaqahFormProps {
  initialData?: {
    id_halaqah?: number;
    name_halaqah: string;
    muhafiz_id: number;
  };
  onSuccess?: () => void;
}

export function HalaqahForm({ initialData, onSuccess }: HalaqahFormProps) {
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  const [existingHalaqahs, setExistingHalaqahs] = useState<Halaqah[]>([]);
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
      muhafiz_id: initialData?.muhafiz_id || 0,
    },
  });

  const selectedMuhafizId = watch("muhafiz_id");

  // Load muhafiz dan halaqah yang sudah ada untuk pengecekan "availability"
  useEffect(() => {
    const loadRequiredData = async () => {
      try {
        const [mList, hList] = await Promise.all([
          muhafizService.getAllMuhafiz(),
          halaqahManagementService.getAllHalaqah()
        ]);
        setMuhafizList(mList);
        setExistingHalaqahs(hList);
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
    const takenMuhafizIds = existingHalaqahs.map((h) => h.muhafiz_id);

    return muhafizList.filter((m) => {
      const isCurrentMuhafiz = m.id_user === initialData?.muhafiz_id;
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
        await halaqahManagementService.updateHalaqah(initialData.id_halaqah, data);
      } else {
        await halaqahManagementService.createHalaqah(data);
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
        <Label htmlFor="muhafiz_id">Muhafiz Pengampu</Label>
        <Select
          disabled={isLoadingData || isSubmitting}
          value={selectedMuhafizId !== 0 ? selectedMuhafizId.toString() : undefined}
          onValueChange={(value) => setValue("muhafiz_id", parseInt(value), { shouldValidate: true })}
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
                  {m.username} ({m.email})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.muhafiz_id && (
          <p className="text-sm text-destructive">{errors.muhafiz_id.message}</p>
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