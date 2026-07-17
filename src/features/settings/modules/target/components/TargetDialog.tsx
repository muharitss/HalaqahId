import { Loader2, Compass } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { HariAktifPicker } from "./HariAktifPicker";
import type { TargetFormValues } from "../validation/target.schema";
import type { TargetSekolah } from "@/types/domain/target";
import type { KategoriSetoranResponse } from "@/features/sekolah";

const TIPE_OPTIONS = [
  { value: "HARIAN", label: "Harian", desc: "Target per sesi setoran, dengan pilihan hari aktif" },
  { value: "MINGGUAN", label: "Mingguan", desc: "Dievaluasi per minggu (Senin–Minggu)" },
  { value: "BULANAN", label: "Bulanan", desc: "Dievaluasi per bulan" },
  { value: "SEMESTER", label: "Semester", desc: "Dievaluasi per semester (Jan–Jun / Jul–Des)" },
  { value: "GLOBAL", label: "Semua Waktu", desc: "Tidak terikat periode tertentu" },
] as const;

const SATUAN_OPTIONS = [
  { value: "HALAMAN", label: "Halaman", hint: "Standar mushaf 15 baris/halaman" },
  { value: "BARIS", label: "Baris", hint: "Jumlah baris mushaf (1 hal = 15 baris)" },
  { value: "AYAT", label: "Ayat", hint: "Jumlah ayat Al-Quran" },
  { value: "JUZ", label: "Juz", hint: "1 Juz ≈ 20 halaman / 304 ayat" },
] as const;

const ARAH_OPTIONS = [
  { value: "BEBAS", label: "Bebas", desc: "Santri dapat menyetor bagian mana saja secara acak" },
  { value: "MAJU", label: "Maju", desc: "Santri harus menyetor berurutan maju (surah awal ke surah akhir)" },
  { value: "MUNDUR", label: "Mundur", desc: "Santri harus menyetor berurutan mundur (surah akhir ke surah awal)" },
] as const;

interface TargetDialogProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  editingTarget: TargetSekolah | null;
  form: UseFormReturn<TargetFormValues>;
  kategoriList: KategoriSetoranResponse[];
  isLoadingKategori: boolean;
  isHarian: boolean;
  isPending: boolean;
  handleSubmit: (values: TargetFormValues) => void;
}

export function TargetDialog({
  isFormOpen,
  setIsFormOpen,
  editingTarget,
  form,
  kategoriList,
  isLoadingKategori,
  isHarian,
  isPending,
  handleSubmit,
}: TargetDialogProps) {
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTarget ? "Edit Target Setoran" : "Tambah Target Setoran"}
          </DialogTitle>
          <DialogDescription>
            Buat target hafalan yang fleksibel sesuai kurikulum sekolah Anda.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Nama Target */}
            <FormField
              control={form.control}
              name="nama_target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Target <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Setoran Harian 1 Halaman" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kategori Setoran */}
            <FormField
              control={form.control}
              name="id_kategori"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Setoran <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val, 10))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori setoran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingKategori ? (
                        <div className="flex items-center justify-center p-2 text-xs text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Memuat kategori...
                        </div>
                      ) : kategoriList.length === 0 ? (
                        <div className="p-2 text-xs text-muted-foreground">
                          Belum ada kategori setoran. Buat kategori terlebih dahulu.
                        </div>
                      ) : (
                        kategoriList.map((kat) => (
                          <SelectItem key={kat.id_kategori} value={kat.id_kategori.toString()}>
                            {kat.nama_kategori}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipe & Satuan */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="tipe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periode <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih periode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="satuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Satuan <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih satuan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SATUAN_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hari Aktif Picker */}
            {isHarian && (
              <FormField
                control={form.control}
                name="hari_aktif"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <HariAktifPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Nilai Target */}
            <FormField
              control={form.control}
              name="nilai_target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nilai Target <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="Contoh: 1 (halaman) atau 15 (baris)"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Boleh desimal, contoh: 0.5 halaman (= setengah halaman = 7–8 baris)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deskripsi */}
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi <span className="text-muted-foreground">(opsional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contoh: Untuk santri reguler, target setoran 1 halaman per pertemuan"
                      className="resize-none"
                      rows={2}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kustomisasi Kurikulum & Batasan */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-primary" />
                Kustomisasi Kurikulum & Batasan (Opsional)
              </h3>
              <p className="text-xs text-muted-foreground">
                Gunakan bagian ini untuk membatasi setoran santri pada rentang tertentu atau mengatur alur/arah setoran.
              </p>

              {/* Arah Setoran */}
              <FormField
                control={form.control}
                name="arah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arah Setoran</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih arah" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ARAH_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex flex-col text-left">
                              <span className="font-medium text-xs sm:text-sm">{opt.label}</span>
                              <span className="text-[10px] sm:text-xs text-muted-foreground">{opt.desc}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Batasan Juz */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="start_juz"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mulai Juz</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          placeholder="Contoh: 1"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? null : parseInt(val, 10));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_juz"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selesai Juz</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          placeholder="Contoh: 30"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? null : parseInt(val, 10));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Daftar Surah Pilihan */}
              <FormField
                control={form.control}
                name="daftar_surat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daftar Surah Pilihan (ID dipisah koma)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: 18,36,56,67"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">
                      Batasi setoran santri hanya untuk surah-surah ini. Masukkan nomor surah (ID) dipisahkan koma.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
