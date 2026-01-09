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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus } from "@fortawesome/free-solid-svg-icons";

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
  const [successMessage, setSuccessMessage] = useState<string>("");
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

  // Load daftar muhafiz yang tersedia
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
    } finally {
      setLoadingMuhafiz(false);
    }
  };

  async function onSubmit(values: HalaqahFormValues) {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data: CreateHalaqahData = {
        nama_halaqah: values.nama_halaqah,
        jenis: values.jenis,
        muhafidz_id: values.muhafidz_id,
      };

      if (initialData?.id_halaqah) {
        // Update existing halaqah
        await halaqahService.updateHalaqah(initialData.id_halaqah, data);
        setSuccessMessage("Halaqah berhasil diperbarui!");
      } else {
        // Create new halaqah
        await halaqahService.createHalaqah(data);
        setSuccessMessage("Halaqah berhasil dibuat!");
      }

      form.reset();
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (error: any) {
      console.error("Error:", error);
      const message = error.response?.data?.message || "Terjadi kesalahan saat menyimpan halaqah";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {successMessage && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Nama Halaqah Field */}
          <FormField
            control={form.control}
            name="nama_halaqah"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Nama Halaqah</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light">
                      <FontAwesomeIcon icon={faBook} className="text-[18px]" />
                    </span>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Contoh: Halaqah Al-Quran A"
                      disabled={isLoading}
                      className="h-12 pl-10 border-[#d6e7d0]"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Jenis Halaqah Field */}
          <FormField
            control={form.control}
            name="jenis"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Jenis Halaqah</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih jenis halaqah" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BACAAN">Bacaan</SelectItem>
                    <SelectItem value="HAFALAN">Hafalan</SelectItem>
                    <SelectItem value="KHUSUS">Khusus</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Muhafidz Field */}
          <FormField
            control={form.control}
            name="muhafidz_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Muhafidz</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="h-12" disabled={loadingMuhafiz || isLoading}>
                      {loadingMuhafiz ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="h-4 w-4" />
                          Memuat daftar muhafidz...
                        </span>
                      ) : (
                        <SelectValue placeholder="Pilih muhafidz" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableMuhafiz.length === 0 ? (
                      <SelectItem value="0" disabled>
                        Tidak ada muhafidz tersedia
                      </SelectItem>
                    ) : (
                      availableMuhafiz.map((muhafiz) => (
                        <SelectItem key={muhafiz.id_user} value={muhafiz.id_user.toString()}>
                          {muhafiz.username} - {muhafiz.email}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
                {availableMuhafiz.length === 0 && !loadingMuhafiz && (
                  <p className="text-xs text-yellow-600">
                    Semua muhafidz sudah memiliki halaqah. Buat akun muhafidz baru terlebih dahulu.
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || loadingMuhafiz || availableMuhafiz.length === 0}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/20 mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Menyimpan...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                {initialData?.id_halaqah ? "Perbarui Halaqah" : "Buat Halaqah"}
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}