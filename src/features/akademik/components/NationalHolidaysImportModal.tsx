import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { NationalHolidayItem } from "../types";

// Standard Indonesian National & Islamic Holidays
export const PRESET_NATIONAL_HOLIDAYS: Record<number, NationalHolidayItem[]> = {
  2026: [
    { tanggal: "2026-01-01", keterangan: "Tahun Baru 2026 Masehi" },
    { tanggal: "2026-01-16", keterangan: "Isra Mi'raj Nabi Muhammad SAW" },
    { tanggal: "2026-02-17", keterangan: "Tahun Baru Imlek 2577 Kongzili" },
    { tanggal: "2026-03-21", keterangan: "Hari Raya Nyepi Tahun Baru Saka 1948" },
    { tanggal: "2026-03-20", keterangan: "Hari Raya Idul Fitri 1447 H (Hari ke-1)" },
    { tanggal: "2026-03-21", keterangan: "Hari Raya Idul Fitri 1447 H (Hari ke-2)" },
    { tanggal: "2026-04-03", keterangan: "Wafat Yesus Kristus" },
    { tanggal: "2026-05-01", keterangan: "Hari Buruh Internasional" },
    { tanggal: "2026-05-14", keterangan: "Kenaikan Yesus Kristus" },
    { tanggal: "2026-05-27", keterangan: "Hari Raya Idul Adha 1447 H" },
    { tanggal: "2026-05-31", keterangan: "Hari Raya Waisak 2570 BE" },
    { tanggal: "2026-06-01", keterangan: "Hari Lahir Pancasila" },
    { tanggal: "2026-06-16", keterangan: "Tahun Baru Islam 1448 Hijriah" },
    { tanggal: "2026-08-17", keterangan: "Hari Kemerdekaan Republik Indonesia" },
    { tanggal: "2026-08-25", keterangan: "Maulid Nabi Muhammad SAW" },
    { tanggal: "2026-12-25", keterangan: "Hari Raya Natal" },
  ],
  2027: [
    { tanggal: "2027-01-01", keterangan: "Tahun Baru 2027 Masehi" },
    { tanggal: "2027-01-06", keterangan: "Isra Mi'raj Nabi Muhammad SAW" },
    { tanggal: "2027-02-06", keterangan: "Tahun Baru Imlek 2578 Kongzili" },
    { tanggal: "2027-03-10", keterangan: "Hari Raya Idul Fitri 1448 H (Hari ke-1)" },
    { tanggal: "2027-03-11", keterangan: "Hari Raya Idul Fitri 1448 H (Hari ke-2)" },
    { tanggal: "2027-03-26", keterangan: "Wafat Yesus Kristus" },
    { tanggal: "2027-05-01", keterangan: "Hari Buruh Internasional" },
    { tanggal: "2027-05-06", keterangan: "Kenaikan Yesus Kristus" },
    { tanggal: "2027-05-17", keterangan: "Hari Raya Idul Adha 1448 H" },
    { tanggal: "2027-05-20", keterangan: "Hari Raya Waisak 2571 BE" },
    { tanggal: "2027-06-01", keterangan: "Hari Lahir Pancasila" },
    { tanggal: "2027-06-06", keterangan: "Tahun Baru Islam 1449 Hijriah" },
    { tanggal: "2027-08-15", keterangan: "Maulid Nabi Muhammad SAW" },
    { tanggal: "2027-08-17", keterangan: "Hari Kemerdekaan Republik Indonesia" },
    { tanggal: "2027-12-25", keterangan: "Hari Raya Natal" },
  ],
};

interface NationalHolidaysImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: NationalHolidayItem[]) => Promise<void>;
  isImporting?: boolean;
}

export function NationalHolidaysImportModal({
  open,
  onOpenChange,
  onImport,
  isImporting = false,
}: NationalHolidaysImportModalProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const holidayPresets = PRESET_NATIONAL_HOLIDAYS[selectedYear] || PRESET_NATIONAL_HOLIDAYS[2026] || [];

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    holidayPresets.forEach((item) => {
      initial[`${item.tanggal}-${item.keterangan}`] = true;
    });
    return initial;
  });

  const handleYearChange = (yearStr: string) => {
    const yr = parseInt(yearStr, 10);
    setSelectedYear(yr);
    const presets = PRESET_NATIONAL_HOLIDAYS[yr] || [];
    const updated: Record<string, boolean> = {};
    presets.forEach((item) => {
      updated[`${item.tanggal}-${item.keterangan}`] = true;
    });
    setSelectedItems(updated);
  };

  const handleToggleAll = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    holidayPresets.forEach((item) => {
      updated[`${item.tanggal}-${item.keterangan}`] = checked;
    });
    setSelectedItems(updated);
  };

  const handleToggleItem = (key: string, checked: boolean) => {
    setSelectedItems((prev) => ({ ...prev, [key]: checked }));
  };

  const selectedCount = holidayPresets.filter(
    (item) => selectedItems[`${item.tanggal}-${item.keterangan}`]
  ).length;

  const handleConfirmImport = async () => {
    const toImport = holidayPresets.filter(
      (item) => selectedItems[`${item.tanggal}-${item.keterangan}`]
    );
    if (toImport.length === 0) return;
    await onImport(toImport);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Hari Libur Nasional</DialogTitle>
          <DialogDescription>
            Pilih tahun dan daftar hari libur nasional Indonesia untuk diimpor secara otomatis ke kalender akademik.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tahun:</span>
            <Select
              value={selectedYear.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-28 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {selectedCount} dari {holidayPresets.length} dipilih
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={() => handleToggleAll(selectedCount !== holidayPresets.length)}
            >
              {selectedCount === holidayPresets.length ? "Batal Pilih Semua" : "Pilih Semua"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1 max-h-[45vh]">
          {holidayPresets.map((item) => {
            const key = `${item.tanggal}-${item.keterangan}`;
            const isChecked = !!selectedItems[key];
            return (
              <div
                key={key}
                onClick={() => handleToggleItem(key, !isChecked)}
                className={`flex items-start gap-3 p-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${
                  isChecked
                    ? "bg-primary/5 border-primary/30"
                    : "bg-background border-border/60 opacity-60 hover:opacity-100"
                }`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(c) => handleToggleItem(key, c === true)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.keterangan}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="border-t pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleConfirmImport}
            disabled={isImporting || selectedCount === 0}
          >
            {isImporting ? "Mengimpor..." : `Import ${selectedCount} Hari Libur`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
