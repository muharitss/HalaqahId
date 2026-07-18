import {
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
import { pemetaanJuz } from "@/utils/daftarSurah";
import { type MushafSelection } from "../../../types";

interface JuzSelectorProps {
  form: any;
  setMushafSelection: (s: MushafSelection | null) => void;
}

export function JuzSelector({ form, setMushafSelection }: JuzSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="juz"
      render={({ field }) => (
        <FormItem className="md:col-span-4">
          <FormLabel>Referensi Juz Utama</FormLabel>
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
              setMushafSelection(null);
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
  );
}