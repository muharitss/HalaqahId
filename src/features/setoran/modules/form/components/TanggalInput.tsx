import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TanggalInputProps {
  form: any;
}

export function TanggalInput({ form }: TanggalInputProps) {
  return (
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
  );
}