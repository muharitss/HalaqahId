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

const KATEGORI_LIST = ["HAFALAN", "MURAJAAH", "ZIYADAH", "INTENS", "BACAAN"];
const KATEGORI_COLOR: Record<string, string> = {
  HAFALAN: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  MURAJAAH: "bg-blue-500/10 text-blue-700 border-blue-200",
  ZIYADAH: "bg-violet-500/10 text-violet-700 border-violet-200",
  INTENS: "bg-amber-500/10 text-amber-700 border-amber-200",
  BACAAN: "bg-rose-500/10 text-rose-700 border-rose-200",
};

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

interface LaporanFilterBarProps {
  // Halaqah
  halaqahNames: string[];
  activeHalaqah: string;
  onHalaqahChange: (v: string) => void;

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

  // Reset
  onReset: () => void;
  isFilterActive: boolean;
}

export function LaporanFilterBar({
  halaqahNames,
  activeHalaqah,
  onHalaqahChange,
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
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Filter Laporan
        </p>
        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
            onClick={onReset}
          >
            <FilterX className="h-3 w-3" />
            Reset filter
            <Badge variant="secondary" className="text-[10px] h-4 px-1">
              {activeCount}
            </Badge>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* ── HALAQAH ── */}
        <Select
          value={activeHalaqah || "all"}
          onValueChange={(v) => onHalaqahChange(v === "all" ? "all" : v)}
        >
          <SelectTrigger className="h-8 gap-1.5 text-xs w-auto min-w-36 border-dashed">
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

        {/* ── SANTRI ── */}
        <Popover open={santriOpen} onOpenChange={setSantriOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              className={cn(
                "h-8 gap-1.5 text-xs border-dashed min-w-36 justify-between font-normal",
                selectedSantri && "border-primary/50 text-primary bg-primary/5"
              )}
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

        {/* ── SEPARATOR ── */}
        <div className="h-8 w-px bg-border self-center" />

        {/* ── BULAN ── (disabled jika date range aktif) */}
        <Select
          value={selectedMonth !== null && !isDateRangeMode ? String(selectedMonth) : "__all__"}
          onValueChange={(v) => onMonthChange(v === "__all__" ? null : Number(v))}
          disabled={isDateRangeMode}
        >
          <SelectTrigger
            className={cn(
              "h-8 gap-1.5 text-xs w-36 border-dashed",
              isDateRangeMode && "opacity-40 cursor-not-allowed"
            )}
          >
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

        {/* ── TAHUN ── (disabled jika date range aktif) */}
        <Select
          value={selectedYear !== null && !isDateRangeMode ? String(selectedYear) : "__all__"}
          onValueChange={(v) => onYearChange(v === "__all__" ? null : Number(v))}
          disabled={isDateRangeMode}
        >
          <SelectTrigger
            className={cn(
              "h-8 text-xs w-28 border-dashed",
              isDateRangeMode && "opacity-40 cursor-not-allowed"
            )}
          >
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

        {/* ── SEPARATOR ── */}
        <div className="h-8 w-px bg-border self-center hidden sm:block" />

        {/* ── DATE RANGE: DARI ── */}
        <Popover open={calFromOpen} onOpenChange={setCalFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1.5 text-xs border-dashed font-normal min-w-36",
                dateFrom && "border-primary/50 text-primary bg-primary/5"
              )}
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
              className={cn(
                "h-8 gap-1.5 text-xs border-dashed font-normal min-w-36",
                dateTo && "border-primary/50 text-primary bg-primary/5"
              )}
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

        {/* ── SEPARATOR ── */}
        <div className="h-8 w-px bg-border self-center" />

        {/* ── KATEGORI ── */}
        <Select
          value={selectedKategori || "__all__"}
          onValueChange={(v) => onKategoriChange(v === "__all__" ? "" : v)}
        >
          <SelectTrigger className="h-8 gap-1.5 text-xs w-36 border-dashed">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">
              <span className="text-xs">Semua Kategori</span>
            </SelectItem>
            {KATEGORI_LIST.map((k) => (
              <SelectItem key={k} value={k}>
                <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded", KATEGORI_COLOR[k])}>
                  {k}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Active filter pills ── */}
      {isFilterActive && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {activeHalaqah !== "" && activeHalaqah !== "all" && (
            <Badge variant="secondary" className="text-[10px] h-5 px-2 gap-1 font-normal">
              <GraduationCap className="h-2.5 w-2.5" />
              {activeHalaqah}
              <button onClick={() => onHalaqahChange("all")} className="ml-0.5 hover:text-foreground opacity-50 hover:opacity-100">✕</button>
            </Badge>
          )}
          {selectedSantri !== "" && (
            <Badge variant="secondary" className="text-[10px] h-5 px-2 gap-1 font-normal">
              <Users className="h-2.5 w-2.5" />
              {selectedSantri}
              <button onClick={() => onSantriChange("")} className="ml-0.5 hover:text-foreground opacity-50 hover:opacity-100">✕</button>
            </Badge>
          )}
          {isDateRangeMode && (
            <Badge variant="outline" className="text-[10px] h-5 px-2 gap-1 font-normal border-primary/40 text-primary bg-primary/5">
              <CalendarDays className="h-2.5 w-2.5" />
              {dateFrom && format(dateFrom, "dd MMM", { locale: idLocale })}
              {dateFrom && dateTo && " – "}
              {dateTo && format(dateTo, "dd MMM yyyy", { locale: idLocale })}
              <button
                onClick={() => { onDateFromChange(null); onDateToChange(null); }}
                className="ml-0.5 hover:text-foreground opacity-60 hover:opacity-100"
              >✕</button>
            </Badge>
          )}
          {selectedKategori !== "" && (
            <Badge
              variant="outline"
              className={cn("text-[10px] h-5 px-2 gap-1 font-semibold border", KATEGORI_COLOR[selectedKategori])}
            >
              {selectedKategori}
              <button onClick={() => onKategoriChange("")} className="ml-0.5 opacity-60 hover:opacity-100">✕</button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
