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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { MONTHS, YEARS } from "../constants";
import { usePeriodFilter } from "../hooks";

interface LaporanFilterBarProps {
  halaqahNames: string[];
  activeHalaqah: string;
  onHalaqahChange: (v: string) => void;
  showHalaqahSelect?: boolean;

  santriNames: string[];
  selectedSantri: string;
  onSantriChange: (v: string) => void;

  selectedMonth: number | null;
  selectedYear: number | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  filterMode: "month" | "week" | "range";
  selectedWeek: number | null;
  onPeriodChange: (
    mode: "month" | "week" | "range",
    payload: {
      selectedMonth: number | null;
      selectedYear: number | null;
      selectedWeek: number | null;
      dateFrom: Date | null;
      dateTo: Date | null;
    }
  ) => void;

  selectedKategori: string;
  onKategoriChange: (v: string) => void;
  kategoriNames?: string[];

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
  dateFrom,
  dateTo,
  filterMode,
  selectedWeek,
  onPeriodChange,
  selectedKategori,
  onKategoriChange,
  kategoriNames = [],
  onReset,
  isFilterActive,
}: LaporanFilterBarProps) {
  const [santriOpen, setSantriOpen] = useState(false);

  const {
    periodOpen,
    setPeriodOpen,
    tempMode,
    setTempMode,
    tempMonth,
    setTempMonth,
    tempYear,
    setTempYear,
    tempWeek,
    setTempWeek,
    tempDateFrom,
    setTempDateFrom,
    tempDateTo,
    setTempDateTo,
    calFromOpen,
    setCalFromOpen,
    calToOpen,
    setCalToOpen,
    daysInMonth,
    handleModeChange,
    handleApplyPeriod,
    getPeriodTriggerLabel,
  } = usePeriodFilter({
    filterMode,
    selectedMonth,
    selectedYear,
    selectedWeek,
    dateFrom,
    dateTo,
    onPeriodChange,
  });
  const getRecentMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        label: i === 0 
          ? `${MONTHS[d.getMonth()]} ${d.getFullYear()} (Bulan Ini)`
          : `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
        month: d.getMonth(),
        year: d.getFullYear(),
      });
    }
    return months;
  };

  const handleSelectThisWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const fromDate = new Date(today.getFullYear(), today.getMonth(), diffToMonday, 0, 0, 0, 0);
    const toDate = new Date(today.getFullYear(), today.getMonth(), diffToMonday + 6, 23, 59, 59, 999);
    onPeriodChange("range", {
      selectedMonth: null,
      selectedYear: null,
      selectedWeek: null,
      dateFrom: fromDate,
      dateTo: toDate,
    });
    setPeriodOpen(false);
  };

  const handleSelectMonthOption = (val: string) => {
    if (!val) return;
    const [yearStr, monthStr] = val.split("-");
    onPeriodChange("month", {
      selectedMonth: Number(monthStr),
      selectedYear: Number(yearStr),
      selectedWeek: null,
      dateFrom: null,
      dateTo: null,
    });
    setPeriodOpen(false);
  };

  const getCurrentMonthOptionValue = () => {
    if (filterMode === "month" && selectedMonth !== null && selectedYear !== null) {
      return `${selectedYear}-${selectedMonth}`;
    }
    return "";
  };

  const handleApplyRange = () => {
    onPeriodChange("range", {
      selectedMonth: null,
      selectedYear: null,
      selectedWeek: null,
      dateFrom: tempDateFrom,
      dateTo: tempDateTo,
    });
    setPeriodOpen(false);
  };

  const isThisWeekSelected = () => {
    if (filterMode !== "range" || !dateFrom || !dateTo) return false;
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), diffToMonday, 0, 0, 0, 0);
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), diffToMonday + 6, 23, 59, 59, 999);
    return (
      dateFrom.getTime() >= startOfWeek.getTime() - 1000 &&
      dateFrom.getTime() <= startOfWeek.getTime() + 1000 &&
      dateTo.getTime() >= endOfWeek.getTime() - 1000 &&
      dateTo.getTime() <= endOfWeek.getTime() + 1000
    );
  };

  const getCustomPeriodTriggerLabel = () => {
    if (isThisWeekSelected()) {
      return "Pekan Ini";
    }
    return getPeriodTriggerLabel();
  };

  // Active filters count
  let activeCount = 0;
  if (activeHalaqah !== "" && activeHalaqah !== "all") activeCount++;
  if (selectedSantri !== "") activeCount++;
  if (filterMode === "range" || filterMode === "week") {
    activeCount++;
  } else {
    const currentM = new Date().getMonth();
    const currentY = new Date().getFullYear();
    if (selectedMonth !== currentM) activeCount++;
    if (selectedYear !== currentY) activeCount++;
  }
  if (selectedKategori !== "") activeCount++;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 items-center">
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
                  onSelect={() => {
                    onSantriChange("");
                    setSantriOpen(false);
                  }}
                  className="text-xs"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      selectedSantri === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Semua Santri
                </CommandItem>
                {santriNames.map((s) => (
                  <CommandItem
                    key={s}
                    value={s}
                    onSelect={() => {
                      onSantriChange(s);
                      setSantriOpen(false);
                    }}
                    className="text-xs"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        selectedSantri === s ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {s}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* ── CONSOLIDATED PERIOD FILTER SELECTOR ── */}
        <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-normal min-w-[150px] max-w-[180px] justify-between bg-background"
            >
              <span className="flex items-center gap-1.5 truncate mr-1">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{getCustomPeriodTriggerLabel()}</span>
              </span>
              <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3.5 space-y-3" align="start">
            <div className="space-y-1 pb-2 border-b">
              <h4 className="font-semibold text-xs leading-none">Pilih Periode</h4>
              <p className="text-[10px] text-muted-foreground">Filter data setoran berdasarkan waktu.</p>
            </div>
            
            <div className="space-y-3">
              {/* 1. Pekan Ini */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground block px-1">
                  Pekan
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs font-normal h-8 hover:bg-muted"
                  onClick={handleSelectThisWeek}
                >
                  <CalendarDays className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                  Pekan Ini
                </Button>
              </div>

              {/* 2. Pilihan Bulan */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground block px-1">
                  Bulan
                </label>
                <Select
                  value={getCurrentMonthOptionValue()}
                  onValueChange={handleSelectMonthOption}
                >
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="Pilih Bulan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getRecentMonths().map((m, idx) => (
                      <SelectItem key={idx} value={`${m.year}-${m.month}`}>
                        <span className="text-xs">{m.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 3. Pilih Tanggal */}
              <div className="space-y-1.5 pt-2.5 border-t">
                <label className="text-[10px] font-semibold text-muted-foreground block px-1">
                  Pilih Tanggal (Rentang)
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  <Popover open={calFromOpen} onOpenChange={setCalFromOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full gap-1 text-[11px] font-normal justify-start px-2"
                      >
                        <span className="truncate">
                          {tempDateFrom
                            ? format(tempDateFrom, "dd MMM yyyy", { locale: idLocale })
                            : "Mulai"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={tempDateFrom ?? undefined}
                        onSelect={(d) => {
                          setTempDateFrom(d ?? null);
                          setCalFromOpen(false);
                        }}
                        disabled={(d) => (tempDateTo ? d > tempDateTo : false)}
                        locale={idLocale}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover open={calToOpen} onOpenChange={setCalToOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-full gap-1 text-[11px] font-normal justify-start px-2"
                      >
                        <span className="truncate">
                          {tempDateTo
                            ? format(tempDateTo, "dd MMM yyyy", { locale: idLocale })
                            : "Selesai"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={tempDateTo ?? undefined}
                        onSelect={(d) => {
                          setTempDateTo(d ?? null);
                          setCalToOpen(false);
                        }}
                        disabled={(d) => (tempDateFrom ? d < tempDateFrom : false)}
                        locale={idLocale}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] px-2"
                    onClick={() => {
                      setTempDateFrom(null);
                      setTempDateTo(null);
                    }}
                  >
                    Reset Tanggal
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-[10px] px-3 font-semibold"
                    onClick={handleApplyRange}
                    disabled={!tempDateFrom && !tempDateTo}
                  >
                    Terapkan
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

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
            {kategoriNames.map((k) => (
              <SelectItem key={k} value={k}>
                <span className="text-xs">{k}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5 px-2 shrink-0"
            onClick={onReset}
          >
            <FilterX className="h-3.5 w-3.5" />
            Reset
            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
              {activeCount}
            </Badge>
          </Button>
        )}
      </div>

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
          {filterMode === "week" && selectedWeek !== null && (
            <Badge variant="secondary">
              Pekan: Pekan {selectedWeek} ({selectedMonth !== null ? MONTHS[selectedMonth] : ""} {selectedYear})
              <button
                onClick={() => {
                  onPeriodChange("month", {
                    selectedMonth: new Date().getMonth(),
                    selectedYear: new Date().getFullYear(),
                    selectedWeek: null,
                    dateFrom: null,
                    dateTo: null,
                  });
                }}
                className="ml-1 opacity-50 hover:opacity-100"
              >✕</button>
            </Badge>
          )}
          {filterMode === "range" && (dateFrom || dateTo) && (
            <Badge variant="secondary">
              {isThisWeekSelected() ? (
                "Periode: Pekan Ini"
              ) : (
                <>
                  Tanggal: {dateFrom && format(dateFrom, "dd MMM", { locale: idLocale })}
                  {dateFrom && dateTo && " – "}
                  {dateTo && format(dateTo, "dd MMM yyyy", { locale: idLocale })}
                </>
              )}
              <button
                onClick={() => {
                  onPeriodChange("month", {
                    selectedMonth: new Date().getMonth(),
                    selectedYear: new Date().getFullYear(),
                    selectedWeek: null,
                    dateFrom: null,
                    dateTo: null,
                  });
                }}
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
