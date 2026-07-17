"use client";

import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { pemetaanJuz } from "@/utils/daftarSurah";
import { surahNumberToName } from "@/utils/mushafUtils";
import { type SetoranRecord, type SetoranPayload } from "../../../types";
import { type KategoriSetoranResponse } from "@/features/sekolah";
import { useEditSetoranForm } from "../hooks/useEditSetoranForm";

interface EditSetoranModalProps {
  isOpen: boolean;
  onClose: () => void;
  setoran: SetoranRecord | null;
  onSubmit: (id: number, payload: Partial<SetoranPayload>) => Promise<{ success: boolean }>;
}

const ALL_SURAHS = Array.from({ length: 114 }, (_, i) => {
  const num = i + 1;
  const name = surahNumberToName(num);
  return { number: num, name };
});

export function EditSetoranModal({
  isOpen,
  onClose,
  setoran,
  onSubmit,
}: EditSetoranModalProps) {
  const [openMulai, setOpenMulai] = useState(false);
  const [openSelesai, setOpenSelesai] = useState(false);

  const {
    form,
    kategoriList,
    customFields,
    isSubmitting,
    onFormSubmit,
  } = useEditSetoranForm({ isOpen, onClose, setoran, onSubmit });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Setoran Hafalan</DialogTitle>
          <DialogDescription>
            Ubah rincian setoran hafalan santri {setoran?.santri?.nama_santri}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="id_kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {kategoriList.map((kat: KategoriSetoranResponse) => (
                          <SelectItem
                            key={kat.id_kategori}
                            value={kat.id_kategori.toString()}
                          >
                            {kat.nama_kategori}
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
                name="tanggal_setoran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Setoran</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="juz"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referi Juz</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(Number(v));
                        const surahsInJuz = pemetaanJuz[Number(v)] || [];
                        if (surahsInJuz.length > 0) {
                          form.setValue("surat_mulai", surahsInJuz[0].nama);
                          form.setValue("surat_selesai", surahsInJuz[0].nama);
                          form.setValue("ayat_mulai", surahsInJuz[0].ayatMulai);
                          form.setValue("ayat_selesai", surahsInJuz[0].ayatMulai);
                        }
                      }}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Juz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                          <SelectItem key={juzNum} value={juzNum.toString()}>
                            Juz {juzNum}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* POSISI AWAL */}
              <div className="border border-border rounded-xl p-3 bg-muted/10 space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase">Dari Posisi</span>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="surat_mulai"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Surah Awal</FormLabel>
                        <Popover open={openMulai} onOpenChange={setOpenMulai}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between font-normal text-left text-xs h-9 px-2"
                              >
                                {field.value || "Pilih Surah"}
                                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Cari..." className="h-8" />
                              <CommandEmpty>Tidak ada</CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-y-auto">
                                <CommandList>
                                  {ALL_SURAHS.map((surah) => (
                                    <CommandItem
                                      key={surah.number}
                                      value={surah.name}
                                      onSelect={() => {
                                        form.setValue("surat_mulai", surah.name);
                                        if (!form.getValues("surat_selesai")) {
                                          form.setValue("surat_selesai", surah.name);
                                        }
                                        setOpenMulai(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
                                          field.value === surah.name ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {surah.name}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ayat_mulai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Awal</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-9"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* POSISI AKHIR */}
              <div className="border border-border rounded-xl p-3 bg-muted/10 space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase">Sampai Posisi</span>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="surat_selesai"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Surah Akhir</FormLabel>
                        <Popover open={openSelesai} onOpenChange={setOpenSelesai}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between font-normal text-left text-xs h-9 px-2"
                              >
                                {field.value || "Pilih Surah"}
                                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Cari..." className="h-8" />
                              <CommandEmpty>Tidak ada</CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-y-auto">
                                <CommandList>
                                  {ALL_SURAHS.map((surah) => (
                                    <CommandItem
                                      key={surah.number}
                                      value={surah.name}
                                      onSelect={() => {
                                        form.setValue("surat_selesai", surah.name);
                                        setOpenSelesai(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
                                          field.value === surah.name ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {surah.name}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ayat_selesai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Akhir</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-9"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Custom Fields */}
            {customFields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customFields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`custom_values.${field.id}` as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          {(() => {
                            if (field.type === "text") {
                              return <Input placeholder={`Masukkan ${field.label}...`} {...formField} value={formField.value ?? ""} />;
                            }
                            if (field.type === "number") {
                              return (
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...formField}
                                  value={formField.value ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    formField.onChange(val === "" ? "" : Number(val));
                                  }}
                                />
                              );
                            }
                            if (field.type === "select") {
                              return (
                                <Select
                                  onValueChange={formField.onChange}
                                  value={formField.value ?? ""}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((opt: string) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            }
                            if (field.type === "boolean") {
                              return (
                                <div className="flex items-center space-x-2 pt-2">
                                  <Checkbox
                                    id={field.id}
                                    checked={formField.value === true}
                                    onCheckedChange={formField.onChange}
                                  />
                                  <label htmlFor={field.id} className="text-xs font-normal text-muted-foreground cursor-pointer select-none">
                                    Ya / Tidak
                                  </label>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {/* Keterangan */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="keterangan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Input placeholder="Catatan tambahan (opsional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
