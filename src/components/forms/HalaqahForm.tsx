import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { halaqahService } from "@/services/halaqahService";
import { akunService } from "@/services/akunService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { 
  faBook, 
  faCheck, 
  faExclamationTriangle, 
  faInfoCircle,
  faPlus 
} from "@fortawesome/free-solid-svg-icons";

const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  muhafiz_id: z.number().min(1, "Pilih muhafiz pengampu"),
});

type HalaqahFormValues = z.infer<typeof halaqahSchema>;

interface HalaqahFormProps {
  onSuccess?: () => void;
  initialData?: {
    id_halaqah?: number;
    name_halaqah?: string;
    muhafiz_id?: number;
  };
}

export function HalaqahForm({ onSuccess, initialData }: HalaqahFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [allMuhafiz, setAllMuhafiz] = useState<Array<{ id_user: number; username: string; email: string }>>([]);
  const [halaqahList, setHalaqahList] = useState<any[]>([]);

  const form = useForm<HalaqahFormValues>({
    resolver: zodResolver(halaqahSchema),
    defaultValues: {
      name_halaqah: initialData?.name_halaqah || "",
      muhafiz_id: initialData?.muhafiz_id || 0,
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [muhafizRes, halaqahRes] = await Promise.all([
          akunService.getAllMuhafiz(),
          halaqahService.getAllHalaqah()
        ]);
        setAllMuhafiz(muhafizRes.data);
        setHalaqahList(halaqahRes.data);
      } catch (error) {
        toast.error("Gagal sinkronisasi data");
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  const availableMuhafiz = allMuhafiz.filter(m => {
    const isTaken = halaqahList.some(h => h.muhafiz_id === m.id_user);
    // Jika sedang edit, muhafiz yang sekarang harus tetap muncul di pilihan
    if (initialData?.muhafiz_id === m.id_user) return true;
    return !isTaken;
  });

  async function onSubmit(values: HalaqahFormValues) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (initialData?.id_halaqah) {
        await halaqahService.updateHalaqah(initialData.id_halaqah, values);
        toast.success("Halaqah diperbarui");
      } else {
        await halaqahService.createHalaqah(values);
        toast.success("Halaqah berhasil dibuat");
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Alerts Section */}
        <div className="space-y-3">
          {errorMessage && (
            <Alert variant="destructive">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {!loadingData && availableMuhafiz.length === 0 && !initialData && (
            <Alert>
              <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4" />
              <AlertTitle>Muhafiz Penuh</AlertTitle>
              <AlertDescription>Semua muhafiz sudah memiliki halaqah.</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid gap-4 py-2">
          {/* Nama Halaqah */}
          <FormField
            control={form.control}
            name="name_halaqah"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Halaqah</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FontAwesomeIcon icon={faBook} className="absolute left-3 top-3 text-muted-foreground text-sm" />
                    <Input {...field} placeholder="Contoh: Halaqah Abu Bakar" className="pl-10" disabled={isLoading} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Muhafiz */}
          <FormField
            control={form.control}
            name="muhafiz_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Muhafiz Pengampu</FormLabel>
                <Select 
                  onValueChange={(val) => field.onChange(Number(val))} 
                  value={field.value ? String(field.value) : ""}
                  disabled={loadingData || isLoading || availableMuhafiz.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingData ? "Memuat..." : "Pilih Muhafiz"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableMuhafiz.map((m) => (
                      <SelectItem key={m.id_user} value={String(m.id_user)}>
                        <div className="flex flex-col text-left">
                          <span className="font-medium">{m.username}</span>
                          <span className="text-[10px] text-muted-foreground">{m.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-[11px]">
                  Satu muhafiz hanya boleh mengampu satu halaqah.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
          <Button 
            type="submit" 
            className="w-full sm:w-auto" 
            disabled={isLoading || (!initialData && availableMuhafiz.length === 0)}
          >
            {isLoading ? (
              <><Spinner className="mr-2" /> Menyimpan...</>
            ) : (
              <><FontAwesomeIcon icon={initialData?.id_halaqah ? faCheck : faPlus} className="mr-2" /> 
                {initialData?.id_halaqah ? "Simpan Perubahan" : "Buat Halaqah"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}