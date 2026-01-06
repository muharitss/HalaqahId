import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setoranSchema, type SetoranFormValues } from "@/utils/zodSchema";

// UI Components (Shadcn)
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

// Mock Data
const MOCK_SANTRI = [
  { id: 1, nama: "Ahmad" },
  { id: 2, nama: "Zaid Ramadhan" },
  { id: 3, nama: "Umar Mukhtar" },
];

const MOCK_HISTORY = [
  { id: 101, nama: "Ahmad", surah: "Al-Baqarah", ayat: "1-10", nilai: 90, waktu: "08:30" },
  { id: 102, nama: "Zaid Ramadhan", surah: "An-Naba", ayat: "1-40", nilai: 85, waktu: "09:15" },
];

export default function InputSetoranPage() {
    const form = useForm<SetoranFormValues>({
    // Gunakan casting 'as any' pada zodResolver jika versi library bentrok
    resolver: zodResolver(setoranSchema) as any, 
    defaultValues: {
        santri_id: 0,
        surah: "",
        ayat_mulai: 1,
        ayat_selesai: 1,
        nilai: 80,
        catatan: "ulang",
        tanggal: new Date(),
    },
    });

  function onSubmit(data: SetoranFormValues) {
    console.log("Submit Data:", data);
    alert("Setoran Berhasil Disimpan!");
    form.reset({
      ...form.getValues(),
      surah: "",
      ayat_mulai: 1,
      ayat_selesai: 1,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
          Input Setoran Hafalan
        </h2>
        <p className="text-muted-foreground dark:text-text-secondary-dark">
          Silahkan pilih santri dan masukkan detail hafalan.
        </p>
      </div>

      {/* Card Wrapper */}
      <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-surface-dark p-6 shadow-sm transition-colors">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Pilih Santri */}
            <FormField
              control={form.control}
              name="santri_id"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="dark:text-foreground-dark">Santri</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring dark:text-foreground-dark"
                    >
                      <option value={0} disabled>-- Pilih Nama Santri --</option>
                      {MOCK_SANTRI.map((s) => (
                        <option key={s.id} value={s.id}>{s.nama}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-destructive dark:text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Surah */}
              <FormField
                control={form.control}
                name="surah"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="dark:text-foreground-dark">Nama Surah</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Contoh: Al-Baqarah" 
                        {...field} 
                        className="dark:bg-background-dark dark:border-border-dark dark:text-foreground-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ayat Mulai */}
              <FormField
                control={form.control}
                name="ayat_mulai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-foreground-dark">Ayat Mulai</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="dark:bg-background-dark dark:border-border-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ayat Selesai */}
              <FormField
                control={form.control}
                name="ayat_selesai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-foreground-dark">Ayat Selesai</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="dark:bg-background-dark dark:border-border-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nilai */}
              <FormField
                control={form.control}
                name="nilai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-foreground-dark">Nilai</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="dark:bg-background-dark dark:border-border-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Catatan */}
              <FormField
                control={form.control}
                name="catatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-foreground-dark">Catatan</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Tambahkan catatan jika ada" 
                        {...field} 
                        className="dark:bg-background-dark dark:border-border-dark"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-primary hover:bg-primary-dark text-primary-foreground px-10"
              >
                Simpan Setoran
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Tabel Riwayat Hari Ini */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-foreground-dark">Riwayat Setoran Hari Ini</h3>
          <span className="text-xs text-muted-foreground bg-accent/50 dark:bg-surface-dark px-2 py-1 rounded-full border border-border dark:border-border-dark">
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-surface-dark overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/30 dark:bg-background-dark/50 text-muted-foreground font-medium border-b border-border dark:border-border-dark">
                <tr>
                  <th className="px-6 py-3">Nama Santri</th>
                  <th className="px-6 py-3">Surah</th>
                  <th className="px-6 py-3 text-center">Ayat</th>
                  <th className="px-6 py-3 text-center">Nilai</th>
                  <th className="px-6 py-3 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {MOCK_HISTORY.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/10 dark:hover:bg-background-dark/30 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-foreground-dark">{item.nama}</td>
                    <td className="px-6 py-4 dark:text-text-secondary-dark">{item.surah}</td>
                    <td className="px-6 py-4 text-center dark:text-text-secondary-dark">{item.ayat}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary border border-primary/20">
                        {item.nilai}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{item.waktu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {MOCK_HISTORY.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              Belum ada setoran masuk hari ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}