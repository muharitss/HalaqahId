import { Calendar, User, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Term } from "@/components/ui/Term";

interface SantriOption {
  id_santri: number;
  nama_santri: string;
  nomor_induk_santri?: string | null;
}

interface IzinFilterBarProps {
  santriList: SantriOption[];
  selectedSantriId?: number;
  selectedTanggal?: string;
  onSantriChange: (idSantri?: number) => void;
  onTanggalChange: (tanggal?: string) => void;
  onReset: () => void;
}

export function IzinFilterBar({
  santriList,
  selectedSantriId,
  selectedTanggal,
  onSantriChange,
  onTanggalChange,
  onReset,
}: IzinFilterBarProps) {
  const hasActiveFilter = Boolean(selectedSantriId || selectedTanggal);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card p-3 rounded-lg border border-border shadow-xs">
      {/* Santri Filter */}
      <div className="flex-1 min-w-[200px]">
        <Select
          value={selectedSantriId ? String(selectedSantriId) : "ALL"}
          onValueChange={(val) => onSantriChange(val === "ALL" ? undefined : Number(val))}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2 truncate">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Semua Santri" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua <Term code="SANTRI" /></SelectItem>
            {santriList.map((santri) => (
              <SelectItem key={santri.id_santri} value={String(santri.id_santri)}>
                {santri.nama_santri} {santri.nomor_induk_santri ? `(${santri.nomor_induk_santri})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tanggal Filter */}
      <div className="w-full sm:w-[200px]">
        <div className="relative">
          <Input
            type="date"
            value={selectedTanggal || ""}
            onChange={(e) => onTanggalChange(e.target.value || undefined)}
            className="w-full pl-9"
          />
          <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Reset Filter Button */}
      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Reset Filter
        </Button>
      )}
    </div>
  );
}
