import { useQuery } from "@tanstack/react-query";
import { sekolahService, type KategoriSetoranResponse } from "@/features/sekolah";
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

interface KategoriSelectorProps {
  form: any;
}

export function KategoriSelector({ form }: KategoriSelectorProps) {
  const { data: kategoriList = [] } = useQuery({
    queryKey: ["kategori-setoran"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return res.data || [];
    },
  });

  return (
    <FormField
      control={form.control}
      name="id_kategori"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kategori</FormLabel>
          <Select
            onValueChange={(v) => field.onChange(Number(v))}
            value={field.value?.toString()}
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
  );
}