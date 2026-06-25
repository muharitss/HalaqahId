import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Sekolah, type UpdateSekolahRequest } from "@/types/domain/sekolah";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Building2, MapPin, Users, BookOpen } from "lucide-react";

const formSchema = z.object({
  // Identitas
  nama_sekolah: z.string().min(3, "Nama sekolah minimal 3 karakter"),
  nama_singkat: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  no_telepon: z.string().optional(),
  whatsapp: z.string().optional(),
  logo_url: z.string().url("Harus berupa URL valid").optional().or(z.literal("")),
  // Lokasi
  alamat: z.string().optional(),
  kelurahan: z.string().optional(),
  kecamatan: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),
  kode_pos: z.string().optional(),
  negara: z.string().optional(),
  // Kepemimpinan
  kepala_sekolah: z.string().optional(),
  jabatan_kepala: z.string().optional(),
  foto_kepala_url: z.string().url("Harus berupa URL valid").optional().or(z.literal("")),
  // Profil lembaga
  jenis_lembaga: z.enum(["PESANTREN", "MADRASAH", "SEKOLAH_UMUM", "TPA", ""]).optional(),
  jenjang: z.string().optional(),
  deskripsi: z.string().optional(),
  visi: z.string().optional(),
  misi: z.string().optional(),
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
      nama_sekolah: sekolah.nama_sekolah ?? "",
      nama_singkat: sekolah.nama_singkat ?? "",
      email: sekolah.email ?? "",
      no_telepon: sekolah.no_telepon ?? "",
      whatsapp: sekolah.whatsapp ?? "",
      logo_url: sekolah.logo_url ?? "",
      alamat: sekolah.alamat ?? "",
      kelurahan: sekolah.kelurahan ?? "",
      kecamatan: sekolah.kecamatan ?? "",
      kota: sekolah.kota ?? "",
      provinsi: sekolah.provinsi ?? "",
      kode_pos: sekolah.kode_pos ?? "",
      negara: sekolah.negara ?? "Indonesia",
      kepala_sekolah: sekolah.kepala_sekolah ?? "",
      jabatan_kepala: sekolah.jabatan_kepala ?? "",
      foto_kepala_url: sekolah.foto_kepala_url ?? "",
      jenis_lembaga: sekolah.jenis_lembaga ?? "",
      jenjang: sekolah.jenjang ?? "",
      deskripsi: sekolah.deskripsi ?? "",
      visi: sekolah.visi ?? "",
      misi: sekolah.misi ?? "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const success = await onSubmit(values as UpdateSekolahRequest);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <Tabs defaultValue="identitas">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="identitas" className="flex items-center gap-1.5 text-xs">
              <Building2 className="w-3.5 h-3.5" /> Umum
            </TabsTrigger>
            <TabsTrigger value="lokasi" className="flex items-center gap-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5" /> Lokasi
            </TabsTrigger>
            <TabsTrigger value="pimpinan" className="flex items-center gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5" /> Pimpinan
            </TabsTrigger>
            <TabsTrigger value="profil" className="flex items-center gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5" /> Profil
            </TabsTrigger>
          </TabsList>

          {/* Tab: Identitas Umum */}
          <TabsContent value="identitas" className="space-y-4">
            <FormField control={form.control} name="nama_sekolah" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Sekolah <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="Pesantren Darul Quran" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="nama_singkat" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Singkat / Singkatan</FormLabel>
                <FormControl><Input placeholder="Darqu" {...field} /></FormControl>
                <FormDescription>Digunakan di badge dan laporan PDF</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email Sekolah</FormLabel>
                <FormControl><Input type="email" placeholder="admin@sekolah.sch.id" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="no_telepon" render={({ field }) => (
                <FormItem>
                  <FormLabel>No. Telepon</FormLabel>
                  <FormControl><Input placeholder="+62-21-123456" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="whatsapp" render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl><Input placeholder="+628123456789" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="logo_url" render={({ field }) => (
              <FormItem>
                <FormLabel>URL Logo Sekolah</FormLabel>
                <FormControl><Input placeholder="https://cdn.sekolah.id/logo.png" {...field} /></FormControl>
                <FormDescription>Link langsung ke gambar logo (https://...)</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>

          {/* Tab: Lokasi */}
          <TabsContent value="lokasi" className="space-y-4">
            <FormField control={form.control} name="alamat" render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Jalan</FormLabel>
                <FormControl><Textarea placeholder="Jl. Merdeka No. 10, RT 01/RW 02" className="resize-none h-20" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="kelurahan" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelurahan / Desa</FormLabel>
                  <FormControl><Input placeholder="Kelurahan Merdeka" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="kecamatan" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl><Input placeholder="Kec. Kota" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="kota" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota / Kabupaten</FormLabel>
                  <FormControl><Input placeholder="Kota Bandung" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="provinsi" render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <FormControl><Input placeholder="Jawa Barat" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="kode_pos" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Pos</FormLabel>
                  <FormControl><Input placeholder="40111" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="negara" render={({ field }) => (
                <FormItem>
                  <FormLabel>Negara</FormLabel>
                  <FormControl><Input placeholder="Indonesia" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </TabsContent>

          {/* Tab: Pimpinan */}
          <TabsContent value="pimpinan" className="space-y-4">
            <FormField control={form.control} name="kepala_sekolah" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kepala Sekolah / Mudir</FormLabel>
                <FormControl><Input placeholder="Ust. Ahmad Fauzi, M.Pd" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="jabatan_kepala" render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan</FormLabel>
                <FormControl><Input placeholder="Mudir Ma'had / Kepala Sekolah" {...field} /></FormControl>
                <FormDescription>Sesuaikan dengan nomenklatur lembaga Anda</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="foto_kepala_url" render={({ field }) => (
              <FormItem>
                <FormLabel>URL Foto Pimpinan</FormLabel>
                <FormControl><Input placeholder="https://cdn.sekolah.id/kepala.jpg" {...field} /></FormControl>
                <FormDescription>Link langsung ke foto (https://...)</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>

          {/* Tab: Profil Lembaga */}
          <TabsContent value="profil" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="jenis_lembaga" render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Lembaga</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PESANTREN">Pesantren</SelectItem>
                      <SelectItem value="MADRASAH">Madrasah</SelectItem>
                      <SelectItem value="SEKOLAH_UMUM">Sekolah Umum</SelectItem>
                      <SelectItem value="TPA">TPA / TPQ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="jenjang" render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenjang Pendidikan</FormLabel>
                  <FormControl><Input placeholder="SD/MI, SMP/MTs, SMA/MA" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="deskripsi" render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Singkat</FormLabel>
                <FormControl><Textarea placeholder="Selamat datang di Pesantren Darul Quran, lembaga tahfidz terpadu yang berdedikasi..." className="resize-none h-20" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="visi" render={({ field }) => (
              <FormItem>
                <FormLabel>Visi</FormLabel>
                <FormControl><Textarea placeholder="Menjadi lembaga tahfidz Al-Quran yang..." className="resize-none h-16" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="misi" render={({ field }) => (
              <FormItem>
                <FormLabel>Misi</FormLabel>
                <FormControl><Textarea placeholder="1. Menyelenggarakan pendidikan tahfidz..&#10;2. Membentuk akhlak mulia..." className="resize-none h-20" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-2">
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
