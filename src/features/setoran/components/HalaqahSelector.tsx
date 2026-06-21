import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import type { HalaqahSelectorProps } from "../types";

export function HalaqahSelector({ halaqahNames, activeHalaqah, onHalaqahChange }: HalaqahSelectorProps) {
  // Jika tidak ada data sama sekali, tetap return null atau tampilkan skeleton
  if (halaqahNames.length === 0) return null;

  return (
    <Select value={activeHalaqah} onValueChange={onHalaqahChange}>
      <SelectTrigger className="w-full sm:w-52 bg-background shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 max-w-full">
          {/* shrink-0 menjaga icon tidak gepeng saat teks panjang */}
          <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5 text-primary/60 shrink-0" />
          
          <div className="truncate text-left flex-1">
            <SelectValue placeholder="Pilih Halaqah" />
          </div>
        </div>
      </SelectTrigger>
      
      <SelectContent>
        {/* TAMBAHKAN OPSI SEMUA HALAQAH DI SINI */}
        <SelectItem value="all" className="font-medium border-b mb-1 rounded-none">
          Semua Halaqah
        </SelectItem>

        {halaqahNames.map((name: any) => (
          <SelectItem key={name} value={name} className="capitalize">
            <span className="truncate block">{name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}