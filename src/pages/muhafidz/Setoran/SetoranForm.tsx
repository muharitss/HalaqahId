"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { pemetaanJuz } from "@/utils/daftarSurah";

// 1. Definisikan Schema sesuai kebutuhan UI (pecah ayat)
const setoranSchema = z.object({
  santri_id: z.coerce.number().min(1, "Pilih santri"),
  juz: z.coerce.number().min(1).max(30),
  surat: z.string().min(1, "Pilih surah"),
  ayat_mulai: z.coerce.number().min(1),
  ayat_selesai: z.coerce.number().min(1),
  kategori: z.enum(["HAFALAN", "MURAJAAH"]),
  taqwim: z.string().min(1, "Wajib diisi"),
  keterangan: z.string().optional(),
}).refine((data) => data.ayat_selesai >= data.ayat_mulai, {
  message: "Ayat selesai tidak boleh kurang dari mulai",
  path: ["ayat_selesai"],
});

import { type Santri } from "@/services/santriService";

interface SetoranFormValues {

  santri_id: number;
  juz: number;
  surat: string;
  ayat_mulai: number;
  ayat_selesai: number;
  kategori: "HAFALAN" | "MURAJAAH";
  taqwim: string;
  keterangan?: string;
}

interface SetoranFormProps {
  santriList: Santri[];
  onSubmit: (data: {
    santri_id: number;
    juz: number;
    surat: string;
    ayat: string;
    kategori: "HAFALAN" | "MURAJAAH";
    taqwim: string;
    keterangan?: string;
  }) => Promise<{ success: boolean }>;
  loading: boolean;
}



export function SetoranForm({ santriList, onSubmit, loading }: SetoranFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<SetoranFormValues>({
    resolver: zodResolver(setoranSchema) as any,


    defaultValues: {
      santri_id: undefined,
      juz: 1,
      kategori: "HAFALAN",
      surat: "",
      ayat_mulai: undefined,
      ayat_selesai: undefined,
      taqwim: "Mumtaz",
      keterangan: "",
    },
  });

  // Watcher untuk sinkronisasi
  const selectedJuz = form.watch("juz");
  const selectedSurat = form.watch("surat");
  const availableSurah = pemetaanJuz[selectedJuz] || [];
  const currentSurahDetail = availableSurah.find((s) => s.nama === selectedSurat);

  const onFormSubmit = async (values: SetoranFormValues) => {
    // 2. Transformasi ke format yang diminta backend (POST JSON)
    const payload = {
      santri_id: values.santri_id,
      juz: values.juz,
      surat: values.surat,
      ayat: `${values.ayat_mulai}-${values.ayat_selesai}`, // "1-10"
      kategori: values.kategori,
      taqwim: values.taqwim,
      keterangan: values.keterangan,
    };

    const result = await onSubmit(payload);
    if (result.success) {
      form.reset({
        ...form.getValues(),
        santri_id: undefined,
        surat: "",
        ayat_mulai: 1,
        ayat_selesai: 1,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="santri_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Santri</FormLabel>
                <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Pilih Santri" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {santriList.map((s) => (
                      <SelectItem key={s.id_santri} value={s.id_santri.toString()}>{s.nama_santri}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kategori"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="HAFALAN">HAFALAN</SelectItem>
                    <SelectItem value="MURAJAAH">MURAJAAH</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="juz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Juz</FormLabel>
                <Select 
                  onValueChange={(v) => {
                    field.onChange(Number(v));
                    form.setValue("surat", ""); // Reset surah jika juz ganti
                  }} 
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>Juz {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="surat"
            render={({ field }) => (
              <FormItem className="md:col-span-3 flex flex-col">
                <FormLabel className="mb-2">Surah (Juz {selectedJuz})</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full justify-between font-normal">
                        {field.value || "Pilih Surah..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Cari surah..." />
                      <CommandList>
                        <CommandEmpty>Surah tidak ditemukan di juz ini.</CommandEmpty>
                        <CommandGroup>
                          {availableSurah.map((surah) => (
                            <CommandItem
                              key={surah.nama}
                              value={surah.nama}
                              onSelect={() => {
                                form.setValue("surat", surah.nama);
                                form.setValue("ayat_mulai", surah.ayatMulai);
                                form.setValue("ayat_selesai", surah.ayatSelesai);
                                setOpen(false);
                                form.trigger(["ayat_mulai", "ayat_selesai"]);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  surah.nama === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {surah.nama} ({surah.ayatMulai}-{surah.ayatSelesai})
                            </CommandItem>  
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="ayat_mulai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ayat Mulai</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Mulai"
                    {...field}
                    value={field.value || ""} 
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : Number(val));
                    }}
                    onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ayat_selesai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ayat Selesai</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Selesai"
                    {...field}
                    value={field.value || ""} 
                    onChange={(e) => {
                      const val = e.target.value;
                      const numVal = val === "" ? undefined : Number(val);
                      
                      if (numVal && currentSurahDetail && numVal > currentSurahDetail.totalAyat) return;
                      
                      field.onChange(numVal);
                    }}
                    onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taqwim"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Taqwim</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl><Input placeholder="Catatan tambahan (opsional)" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full bg-[#65a30d] hover:bg-[#4d7c0f] text-white font-bold py-6">
          {loading ? "Menyimpan..." : "Simpan Setoran"}
        </Button>
      </form>
    </Form>
  );
}