import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";
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

interface SesiSelectorProps {
  form: any;
  sesiList: SesiHalaqah[];
}

export function SesiSelector({ form, sesiList }: SesiSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="id_sesi"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sesi Halaqah</FormLabel>
          <Select
            onValueChange={(v) => field.onChange(Number(v))}
            value={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Sesi" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {sesiList.map((s) => (
                <SelectItem key={s.id_sesi} value={s.id_sesi.toString()}>
                  {s.nama_sesi}
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