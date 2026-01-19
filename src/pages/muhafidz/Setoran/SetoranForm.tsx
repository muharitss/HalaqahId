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

interface SetoranFormProps {
  santriList: any[];
  onSubmit: (data: SetoranPayload) => Promise<{ success: boolean }>; 
  loading: boolean;
}

export function SetoranForm({ santriList, onSubmit, loading }: SetoranFormProps) {
  const form = useForm<SetoranFormValues>({
    resolver: zodResolver(setoranSchema) as any,
    defaultValues: {
      santri_id: 0,
      juz: 1,
      kategori: "HAFALAN",
      surat: "",
      ayat: "1-10",
      taqwim: "Mumtaz",
    },
  });

const onFormSubmit = async (data: SetoranFormValues) => {
  const result = await onSubmit(data);
  
  if (result.success) {
    form.reset({
      ...form.getValues(),
      surat: "",
      ayat: "1-10",
      keterangan: "", 
    });
  }
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="santri_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Santri</FormLabel>
                <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih santri" />
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="surat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surah</FormLabel>
                <FormControl><Input placeholder="Contoh: Al-Baqarah" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ayat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ayat</FormLabel>
                <FormControl><Input {...field} /></FormControl>
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
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Menyimpan..." : "Simpan Setoran"}
          </Button>
        </div>
      </form>
    </Form>
  );
}