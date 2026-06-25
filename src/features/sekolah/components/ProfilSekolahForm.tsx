import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Sekolah, type UpdateSekolahRequest } from "@/types/domain/sekolah";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

const formSchema = z.object({
  nama_sekolah: z.string().min(3, "Nama sekolah minimal 3 karakter"),
  alamat: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfilSekolahFormProps {
  sekolah: Sekolah;
  onSubmit: (data: UpdateSekolahRequest) => Promise<boolean>;
  saving: boolean;
  onSuccess?: () => void;
}

export const ProfilSekolahForm = ({ sekolah, onSubmit, saving, onSuccess }: ProfilSekolahFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_sekolah: sekolah.nama_sekolah,
      alamat: sekolah.alamat || "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const success = await onSubmit(values);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama_sekolah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sekolah</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama sekolah..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan alamat lengkap sekolah..."
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving}>
            {saving && <span className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>}
            {!saving && <Save className="w-4 h-4 mr-2" />}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Form>
  );
};
