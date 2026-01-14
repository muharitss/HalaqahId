import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { halaqahService, type CreateHalaqahData } from "@/services/halaqahService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Import Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus, faCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const halaqahSchema = z.object({
  nama_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  jenis: z.enum(["BACAAN", "HAFALAN", "KHUSUS"]),
  muhafidz_id: z.number().min(1, "Pilih muhafidz"),
});

type HalaqahFormValues = z.infer<typeof halaqahSchema>;

interface HalaqahFormProps {
  onSuccess?: () => void;
  initialData?: {
    id_halaqah?: number;
    nama_halaqah?: string;
    jenis?: "BACAAN" | "HAFALAN" | "KHUSUS";
    muhafidz_id?: number;
  };
}

export function HalaqahForm({ onSuccess, initialData }: HalaqahFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMuhafiz, setLoadingMuhafiz] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [availableMuhafiz, setAvailableMuhafiz] = useState<Array<{ id_user: number; username: string; email: string }>>([]);

  const form = useForm<HalaqahFormValues>({
    resolver: zodResolver(halaqahSchema),
    defaultValues: {
      nama_halaqah: initialData?.nama_halaqah || "",
      jenis: initialData?.jenis || "HAFALAN",
      muhafidz_id: initialData?.muhafidz_id || 0,
    },
  });

  useEffect(() => {
    loadAvailableMuhafiz();
  }, []);

  const loadAvailableMuhafiz = async () => {
    setLoadingMuhafiz(true);
    try {
      const response = await halaqahService.getAvailableMuhafiz();
      setAvailableMuhafiz(response.data);
    } catch (error) {
      console.error("Error loading muhafiz:", error);
      toast.error("Gagal memuat daftar muhafidz");
    } finally {
      setLoadingMuhafiz(false);
    }
  };

  async function onSubmit(values: HalaqahFormValues) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data: CreateHalaqahData = {
        nama_halaqah: values.nama_halaqah,
        jenis: values.jenis,
        muhafidz_id: values.muhafidz_id,
      };

      if (initialData?.id_halaqah) {
        await halaqahService.updateHalaqah(initialData.id_halaqah, data);
        toast.success("Halaqah berhasil diperbarui");
      } else {
        await halaqahService.createHalaqah(data);
        toast.success("Halaqah baru berhasil dibuat");
      }

      form.reset();
      if (onSuccess) onSuccess(); // Langsung tutup modal/refresh table
    } catch (error: any) {
      const message = error.response?.data?.message || "Terjadi kesalahan saat menyimpan data";
      setErrorMessage(message); // Alert tetap digunakan untuk error agar user bisa baca detailnya
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 text-left">
      {availableMuhafiz.length === 0 && !loadingMuhafiz && (
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
          <AlertTitle>Muhafidz Tidak Tersedia</AlertTitle>
          <AlertDescription className="text-xs">
            Semua muhafidz sudah memiliki halaqah. Silahkan buat akun muhafidz baru terlebih dahulu sebelum membuat halaqah.
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          <FormField
            control={form.control}
            name="nama_halaqah"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Nama Halaqah</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <FontAwesomeIcon icon={faBook} />
                    </span>
                    <Input
                      {...field}
                      placeholder="Contoh: Halaqah Abu Bakar"
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jenis"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Jenis Halaqah</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BACAAN">Bacaan</SelectItem>
                    <SelectItem value="HAFALAN">Hafalan</SelectItem>
                    <SelectItem value="KHUSUS">Khusus</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="muhafidz_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Muhafidz</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value ? field.value.toString() : undefined}
                >
                  <FormControl>
                    <SelectTrigger className="h-11" disabled={loadingMuhafiz || availableMuhafiz.length === 0}>
                      {loadingMuhafiz ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="h-4 w-4" /> Memuat...
                        </span>
                      ) : (
                        <SelectValue placeholder="Pilih muhafidz" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableMuhafiz.map((muhafiz) => (
                      <SelectItem key={muhafiz.id_user} value={muhafiz.id_user.toString()}>
                        {muhafiz.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading || loadingMuhafiz || availableMuhafiz.length === 0}
            className="w-full h-11 mt-2"
          >
            {isLoading ? (
              <><Spinner className="mr-2 h-4 w-4" /> Menyimpan...</>
            ) : (
              <><FontAwesomeIcon icon={initialData?.id_halaqah ? faCheck : faPlus} className="mr-2" /> 
                {initialData?.id_halaqah ? "Simpan Perubahan" : "Buat Halaqah Baru"}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}