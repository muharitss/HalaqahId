import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  CalendarDays,
  ChevronDown,
  FilterX,
  Users,
  BookOpen,
  GraduationCap,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const DEFAULT_KATEGORI_LIST = ["HAFALAN", "MURAJAAH", "ZIYADAH", "INTENS", "BACAAN"];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

interface LaporanFilterBarProps {
  // Halaqah
  halaqahNames: string[];
  activeHalaqah: string;
  onHalaqahChange: (v: string) => void;
  showHalaqahSelect?: boolean;

  // Santri
  santriNames: string[];
  selectedSantri: string;
  onSantriChange: (v: string) => void;

  // Bulan/Tahun
  selectedMonth: number | null;
  selectedYear: number | null;
  onMonthChange: (v: number | null) => void;
  onYearChange: (v: number | null) => void;

  // Date Range
  dateFrom: Date | null;
  dateTo: Date | null;
  onDateFromChange: (v: Date | null) => void;
  onDateToChange: (v: Date | null) => void;

  // Kategori
  selectedKategori: string;
  onKategoriChange: (v: string) => void;
  kategoriNames?: string[];

  // Reset
  onReset: () => void;
  isFilterActive: boolean;
}

export function LaporanFilterBar({
  halaqahNames,
  activeHalaqah,
  onHalaqahChange,
  showHalaqahSelect = true,
  santriNames,
  selectedSantri,
  onSantriChange,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  selectedKategori,
  onKategoriChange,
  kategoriNames = [],
  onReset,
  isFilterActive,
}: LaporanFilterBarProps) {
  const [santriOpen, setSantriOpen] = useState(false);
  const [calFromOpen, setCalFromOpen] = useState(false);
  const [calToOpen, setCalToOpen] = useState(false);

  const isDateRangeMode = dateFrom !== null || dateTo !== null;

  // ─── Active filter count badge ─────────────────────────────────────────────
  let activeCount = 0;
  if (activeHalaqah !== "" && activeHalaqah !== "all") activeCount++;
  if (selectedSantri !== "") activeCount++;
  if (isDateRangeMode) {
    activeCount++;
  } else {
    if (selectedMonth !== null) activeCount++;
    if (selectedYear !== null) activeCount++;
  }
  if (selectedKategori !== "") activeCount++;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Filter Laporan
        </p>
        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
            onClick={onReset}
          >
            <FilterX className="h-3 w-3" />
            Reset filter
            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
              {activeCount}
            </Badge>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* ── HALAQAH ── */}
        {showHalaqahSelect && (
          <Select
            value={activeHalaqah || "all"}
            onValueChange={(v) => onHalaqahChange(v === "all" ? "all" : v)}
          >
            <SelectTrigger className="h-8 text-xs w-auto min-w-36 gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Semua Halaqah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="text-xs">Semua Halaqah</span>
              </SelectItem>
              {halaqahNames.map((h) => (
                <SelectItem key={h} value={h}>
                  <span className="text-xs">{h}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* ── SANTRI ── */}
        <Popover open={santriOpen} onOpenChange={setSantriOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              className="h-8 gap-1.5 text-xs min-w-36 justify-between font-normal"
            >
              <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate max-w-28">
                {selectedSantri || "Semua Santri"}
              </span>
              <ChevronDown className="h-3 w-3 ml-auto shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <Command>
              <CommandInput placeholder="Cari santri..." className="h-8 text-xs" />
              <CommandEmpty className="text-xs py-4 text-center text-muted-foreground">
                Santri tidak ditemukan
              </CommandEmpty>
              <CommandGroup className="max-h-52 overflow-y-auto">
                <CommandItem
                  value=""
                  onSelect={() => { onSantriChange(""); setSantriOpen(false); }}
                  className="text-xs"
                >
                  <Check className={cn("mr-2 h-3 w-3", selectedSantri === "" ? "opacity-100" : "opacity-0")} />
                  Semua Santri
                </CommandItem>
                {santriNames.map((s) => (
                  <CommandItem
                    key={s}
                    value={s}
                    onSelect={() => { onSantriChange(s); setSantriOpen(false); }}
                    className="text-xs"
                  >
                    <Check className={cn("mr-2 h-3 w-3", selectedSantri === s ? "opacity-100" : "opacity-0")} />
                    {s}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* ── BULAN ── */}
        <Select
          value={selectedMonth !== null && !isDateRangeMode ? String(selectedMonth) : "__all__"}
          onValueChange={(v) => onMonthChange(v === "__all__" ? null : Number(v))}
          disabled={isDateRangeMode}
        >
          <SelectTrigger className="h-8 gap-1.5 text-xs w-36">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Semua Bulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">
              <span className="text-xs">Semua Bulan</span>
            </SelectItem>
            {MONTHS.map((m, i) => (
              <SelectItem key={i} value={String(i)}>
                <span className="text-xs">{m}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ── TAHUN ── */}
        <Select
          value={selectedYear !== null && !isDateRangeMode ? String(selectedYear) : "__all__"}
          onValueChange={(v) => onYearChange(v === "__all__" ? null : Number(v))}
          disabled={isDateRangeMode}
        >
          <SelectTrigger className="h-8 text-xs w-28">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">
              <span className="text-xs">Semua Tahun</span>
            </SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                <span className="text-xs">{y}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ── DATE RANGE: DARI ── */}
        <Popover open={calFromOpen} onOpenChange={setCalFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-normal min-w-36"
            >
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {dateFrom
                ? format(dateFrom, "dd MMM yyyy", { locale: idLocale })
                : "Dari tanggal"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 border-b flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">Tanggal Mulai</p>
              {dateFrom && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 text-[10px] text-muted-foreground px-1"
                  onClick={() => { onDateFromChange(null); setCalFromOpen(false); }}
                >
                  Hapus
                </Button>
              )}
            </div>
            <Calendar
              mode="single"
              selected={dateFrom ?? undefined}
              onSelect={(d) => { onDateFromChange(d ?? null); setCalFromOpen(false); }}
              disabled={(d) => dateTo ? d > dateTo : false}
              locale={idLocale}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* ── DATE RANGE: HINGGA ── */}
        <Popover open={calToOpen} onOpenChange={setCalToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-normal min-w-36"
            >
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {dateTo
                ? format(dateTo, "dd MMM yyyy", { locale: idLocale })
                : "Hingga tanggal"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 border-b flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">Tanggal Selesai</p>
              {dateTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 text-[10px] text-muted-foreground px-1"
                  onClick={() => { onDateToChange(null); setCalToOpen(false); }}
                >
                  Hapus
                </Button>
              )}
            </div>
            <Calendar
              mode="single"
              selected={dateTo ?? undefined}
              onSelect={(d) => { onDateToChange(d ?? null); setCalToOpen(false); }}
              disabled={(d) => dateFrom ? d < dateFrom : false}
              locale={idLocale}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* ── KATEGORI ── */}
        <Select
          value={selectedKategori || "__all__"}
          onValueChange={(v) => onKategoriChange(v === "__all__" ? "" : v)}
        >
          <SelectTrigger className="h-8 gap-1.5 text-xs w-36">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">
              <span className="text-xs">Semua Kategori</span>
            </SelectItem>
            {(kategoriNames.length > 0 ? kategoriNames : DEFAULT_KATEGORI_LIST).map((k) => (
              <SelectItem key={k} value={k}>
                <span className="text-xs">{k}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Active filter pills ── */}
      {isFilterActive && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {activeHalaqah !== "" && activeHalaqah !== "all" && (
            <Badge variant="secondary">
              Halaqah: {activeHalaqah}
              <button onClick={() => onHalaqahChange("all")} className="ml-1 opacity-50 hover:opacity-100">✕</button>
            </Badge>
          )}
          {selectedSantri !== "" && (
            <Badge variant="secondary">
              Santri: {selectedSantri}
              <button onClick={() => onSantriChange("")} className="ml-1 opacity-50 hover:opacity-100">✕</button>
            </Badge>
          )}
          {isDateRangeMode && (
            <Badge variant="secondary">
              Tanggal: {dateFrom && format(dateFrom, "dd MMM", { locale: idLocale })}
              {dateFrom && dateTo && " – "}
              {dateTo && format(dateTo, "dd MMM yyyy", { locale: idLocale })}
              <button
                onClick={() => { onDateFromChange(null); onDateToChange(null); }}
                className="ml-1 opacity-50 hover:opacity-100"
              >✕</button>
            </Badge>
          )}
          {selectedKategori !== "" && (
            <Badge variant="secondary">
              Kategori: {selectedKategori}
              <button onClick={() => onKategoriChange("")} className="ml-1 opacity-50 hover:opacity-100">✕</button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

