"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setoranSchema, type SetoranFormValues } from "@/utils/zodSchema";
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
import type { SetoranPayload } from "@/services/setoranService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { daftarSurah } from "@/utils/daftarSurah";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState } from "react";

interface SetoranFormProps {
  santriList: any[];
  onSubmit: (data: SetoranPayload) => Promise<{ success: boolean }>;
  loading: boolean;
}

export function SetoranForm({ santriList, onSubmit, loading }: SetoranFormProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<SetoranFormValues>({
    resolver: zodResolver(setoranSchema) as any,
    defaultValues: {
      // 1. Tetap gunakan undefined agar placeholder "Pilih Santri" muncul otomatis
      santri_id: undefined, 
      juz: 1,
      kategori: "HAFALAN",
      surat: "",
      ayat: "1-10",
      taqwim: "Mumtaz",
    },
  });

  const onFormSubmit = async (values: SetoranFormValues) => {
    // 2. PROTEKSI: Cek apakah santri_id benar-benar ada sebelum kirim
    if (!values.santri_id) {
      alert("Silakan pilih santri terlebih dahulu!");
      return;
    }

    // 3. TRANSFORMASI: Pastikan payload yang dikirim ke service adalah Number murni
    const payload: SetoranPayload = {
      ...values,
      santri_id: Number(values.santri_id),
      juz: Number(values.juz),
    };

    const result = await onSubmit(payload);
    
    if (result.success) {
      // Reset form, namun biarkan santri_id tetap undefined agar kembali ke placeholder
      form.reset({
        ...form.getValues(),
        santri_id: undefined,
        surat: "",
        ayat: "1-10",
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
                {/* 4. LOGIKA VALUE: Jika value undefined, kirim string kosong ke Select shadcn */}
                <Select 
                  onValueChange={(v) => field.onChange(v === "" ? undefined : Number(v))} 
                  value={field.value ? field.value.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Santri" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {santriList.map((s) => (
                      <SelectItem key={s.id_santri} value={s.id_santri.toString()}>
                        {s.nama_santri}
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
            name="kategori"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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

        {/* Baris Sisanya (Juz, Surat, Ayat, Taqwim) tetap sama seperti sebelumnya */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <FormField
              control={form.control}
              name="juz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Juz</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-3">
            <FormField
              control={form.control}
              name="surat"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-2">Surah</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? daftarSurah.find((s) => s === field.value)
                            : "Ketik nama surah..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Cari surah (misal: Al-Fath)..." />
                        <CommandList>
                          <CommandEmpty>Surah tidak ditemukan.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {daftarSurah.map((surah) => (
                              <CommandItem
                                key={surah}
                                value={surah}
                                onSelect={() => {
                                  form.setValue("surat", surah);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    surah === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {surah}
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ayat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ayat</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taqwim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taqwim</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#65a30d] hover:bg-[#4d7c0f] text-white font-bold py-6"
          >
            {loading ? "Menyimpan..." : "Simpan Setoran"}
          </Button>
        </div>
      </form>
    </Form>
  );
}