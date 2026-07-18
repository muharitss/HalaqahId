import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { surahNumberToName } from "@/utils/mushafUtils";
import { type MushafSelection } from "../../../types";
import { MUSHAF_SELECTION_KEY } from "../constants/form.constants";

const ALL_SURAHS = Array.from({ length: 114 }, (_, i) => ({
  number: i + 1,
  name: surahNumberToName(i + 1),
}));

interface SurahPopoverProps {
  value: string;
  onChange: (name: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder: string;
}

function SurahPopover({
  value,
  onChange,
  open,
  onOpenChange,
  placeholder,
}: SurahPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal text-left"
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0 popover-content-custom"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Cari Surah..." />
          <CommandEmpty>Surah tidak ditemukan.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {ALL_SURAHS.map((surah) => (
                <CommandItem
                  key={surah.number}
                  value={surah.name}
                  onSelect={() => {
                    onChange(surah.name);
                    onOpenChange(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === surah.name ? "opacity-100" : "opacity-0"
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
  );
}

interface RangeInputProps {
  form: any;
  setMushafSelection: (s: MushafSelection | null) => void;
}

export function RangeInput({ form, setMushafSelection }: RangeInputProps) {
  const [openMulai, setOpenMulai] = useState(false);
  const [openSelesai, setOpenSelesai] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* POSISI AWAL */}
      <div className="border border-border rounded-2xl p-4 bg-muted/20 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <h4 className="text-xs font-bold text-foreground/80 tracking-wider uppercase">
            Dari Posisi (Awal)
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="surat_mulai"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Surah Awal</FormLabel>
                <SurahPopover
                  value={field.value}
                  onChange={(name) => {
                    form.setValue("surat_mulai", name);
                    if (!form.getValues("surat_selesai")) {
                      form.setValue("surat_selesai", name);
                    }
                    setMushafSelection(null);
                    sessionStorage.removeItem(MUSHAF_SELECTION_KEY);
                  }}
                  open={openMulai}
                  onOpenChange={setOpenMulai}
                  placeholder="Pilih Surah..."
                />
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
                    placeholder="Ayat"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : Number(val));
                      setMushafSelection(null);
                      sessionStorage.removeItem(MUSHAF_SELECTION_KEY);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* POSISI AKHIR */}
      <div className="border border-border rounded-2xl p-4 bg-muted/20 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse" />
          <h4 className="text-xs font-bold text-foreground/80 tracking-wider uppercase">
            Sampai Posisi (Akhir)
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="surat_selesai"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Surah Akhir</FormLabel>
                <SurahPopover
                  value={field.value}
                  onChange={(name) => {
                    form.setValue("surat_selesai", name);
                    setMushafSelection(null);
                    sessionStorage.removeItem(MUSHAF_SELECTION_KEY);
                  }}
                  open={openSelesai}
                  onOpenChange={setOpenSelesai}
                  placeholder="Pilih Surah..."
                />
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
                    placeholder="Ayat"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : Number(val));
                      setMushafSelection(null);
                      sessionStorage.removeItem(MUSHAF_SELECTION_KEY);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}