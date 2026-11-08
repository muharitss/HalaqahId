import { type Santri } from "@/features/santri/types";
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

import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";

interface SantriSelectorProps {
  form: any;
  santriList: Santri[];
}

export function SantriSelector({ form, santriList }: SantriSelectorProps) {
  const labelSantri = useTerminology("SANTRI");

  return (
    <FormField
      control={form.control}
      name="id_santri"
      render={({ field }) => (
        <FormItem>
          <FormLabel><Term code="SANTRI" /></FormLabel>
          <Select
            onValueChange={(v) => field.onChange(Number(v))}
            value={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Pilih ${labelSantri}`} />
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
  );
}