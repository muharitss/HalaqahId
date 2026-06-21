import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Sekolah, type UpdateSekolahRequest } from "@/types/domain/sekolah";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
}

export const ProfilSekolahForm = ({ sekolah, onSubmit, saving }: ProfilSekolahFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_sekolah: sekolah.nama_sekolah,
      alamat: sekolah.alamat || "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profil</CardTitle>
        <CardDescription>
          Ubah informasi nama dan alamat sekolah Anda di sini.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={saving} className="ml-auto">
              {saving && <span className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>}
              {!saving && <Save className="w-4 h-4 mr-2" />}
              Simpan Perubahan
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
