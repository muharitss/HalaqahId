import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface KeteranganInputProps {
  form: any;
}

export function KeteranganInput({ form }: KeteranganInputProps) {
  return (
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
  );
}