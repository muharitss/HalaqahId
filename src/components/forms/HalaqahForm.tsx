import { useState, useEffect } from "react";
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
import { halaqahManagementService } from "@/features/kepala-muhafidz/kelola-halaqah/services/halaqahManagementService"; // Import dari feature
import { getErrorMessage } from "@/utils/error";

const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  muhafiz_id: z.number().min(1, "Pilih muhafiz"),
});

type HalaqahFormValues = {
  name_halaqah: string;
  muhafiz_id: number;
};

interface HalaqahFormProps {
  initialData?: {
    id_halaqah?: number;
    name_halaqah: string;
    muhafiz_id: number;
  };
  onSuccess?: () => void;
}

export function HalaqahForm({ initialData, onSuccess }: HalaqahFormProps) {
  const [muhafizList, setMuhafizList] = useState<any[]>([]);
  const [isLoadingMuhafiz, setIsLoadingMuhafiz] = useState(true);
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

  useEffect(() => {
    const fetchMuhafiz = async () => {
      try {
        const data = await muhafizService.getAllMuhafiz();
        setMuhafizList(data);
      } catch (err) {
        console.error("Gagal mengambil data muhafiz:", err);
      } finally {
        setIsLoadingMuhafiz(false);
      }
    };
    fetchMuhafiz();
  }, []);

  const onSubmit = async (data: HalaqahFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (initialData?.id_halaqah) {
        await halaqahManagementService.updateHalaqah(initialData.id_halaqah, {
          name_halaqah: data.name_halaqah,
          muhafiz_id: data.muhafiz_id,
        });
      } else {
        await halaqahManagementService.createHalaqah({
          name_halaqah: data.name_halaqah,
          muhafiz_id: data.muhafiz_id,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 1500);
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
            {initialData ? "Halaqah berhasil diperbarui!" : "Halaqah berhasil dibuat!"}
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
          disabled={isLoadingMuhafiz || isSubmitting}
          value={selectedMuhafizId?.toString()}
          onValueChange={(value) => setValue("muhafiz_id", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingMuhafiz ? "Memuat data..." : "Pilih muhafiz"} />
          </SelectTrigger>
          <SelectContent>
            {muhafizList.map((m) => (
              <SelectItem key={m.id_user} value={m.id_user.toString()}>
                {m.username} - {m.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.muhafiz_id && (
          <p className="text-sm text-destructive">{errors.muhafiz_id.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
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