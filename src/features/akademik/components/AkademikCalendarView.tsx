import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TahunAjaran, Semester, HariLibur } from "../types";

interface AkademikCalendarViewProps {
  tahunAjaranList: TahunAjaran[];
  activeTahunAjaran?: TahunAjaran | null;
  hariLiburList: HariLibur[];
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function AkademikCalendarView({
  activeTahunAjaran,
  hariLiburList,
}: AkademikCalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    today.toISOString().slice(0, 10)
  );

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDateStr(now.toISOString().slice(0, 10));
  };

  // Map of holiday dates: "YYYY-MM-DD" -> HariLibur[]
  const holidaysByDate = useMemo(() => {
    const map = new Map<string, HariLibur[]>();
    hariLiburList.forEach((h) => {
      const d = h.tanggal ? h.tanggal.slice(0, 10) : "";
      if (!d) return;
      const arr = map.get(d) || [];
      arr.push(h);
      map.set(d, arr);
    });
    return map;
  }, [hariLiburList]);

  // Calendar matrix calculation for currentYear & currentMonth
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Convert Sun=0 to Mon=0

  // Semesters for active tahun ajaran
  const activeSemesters: Semester[] = activeTahunAjaran?.semesters || [];

  const getSemesterForDate = (dateStr: string): Semester | null => {
    for (const sem of activeSemesters) {
      const s = sem.tanggal_mulai ? sem.tanggal_mulai.slice(0, 10) : "";
      const e = sem.tanggal_selesai ? sem.tanggal_selesai.slice(0, 10) : "";
      if (s && e && dateStr >= s && dateStr <= e) {
        return sem;
      }
    }
    return null;
  };

  // Selected date details
  const selectedHolidays = holidaysByDate.get(selectedDateStr) || [];
  const selectedSemester = getSemesterForDate(selectedDateStr);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Visual Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {MONTH_NAMES[currentMonth]} {currentYear}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-xs h-8"
            >
              Hari Ini
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-muted-foreground pb-2 border-b">
            {DAY_LABELS.map((day, idx) => (
              <div
                key={day}
                className={idx >= 5 ? "text-rose-500 dark:text-rose-400" : ""}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 rounded-md bg-muted/10" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const monthStr = String(currentMonth + 1).padStart(2, "0");
              const dayStr = String(day).padStart(2, "0");
              const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
              const isSelected = selectedDateStr === dateStr;
              const isToday =
                today.getFullYear() === currentYear &&
                today.getMonth() === currentMonth &&
                today.getDate() === day;

              const holidays = holidaysByDate.get(dateStr) || [];
              const hasHoliday = holidays.length > 0;
              const semester = getSemesterForDate(dateStr);
              const dayOfWeek = (firstDayIndex + i) % 7;
              const isWeekend = dayOfWeek >= 5;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 p-1.5 rounded-md border text-left flex flex-col justify-between transition-colors relative ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : isToday
                        ? "border-primary/50 bg-accent/40"
                        : hasHoliday
                          ? "border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20"
                          : semester
                            ? "border-border/60 bg-card hover:bg-muted/40"
                            : "border-border/40 bg-muted/5 hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center ${
                        isToday
                          ? "bg-primary text-primary-foreground font-bold"
                          : hasHoliday || isWeekend
                            ? "text-rose-600 dark:text-rose-400 font-bold"
                            : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>

                    {hasHoliday && (
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                    )}
                  </div>

                  {/* Badges / indicators */}
                  <div className="truncate w-full space-y-0.5">
                    {hasHoliday && (
                      <div className="text-[9px] font-medium text-rose-600 dark:text-rose-400 truncate">
                        {holidays[0].keterangan}
                      </div>
                    )}
                    {semester && !hasHoliday && (
                      <div className="text-[8px] text-muted-foreground truncate opacity-70">
                        {semester.nama}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-4 mt-4 border-t">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span>Hari Ini</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span>Hari Libur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-primary/50 bg-primary/10" />
              <span>Tanggal Terpilih</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Detail & Info Panel */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Agenda Tanggal
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {new Date(selectedDateStr).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Active Academic Year */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tahun Ajaran Aktif
            </span>
            <p className="text-sm font-medium">
              {activeTahunAjaran ? (
                <span className="flex items-center gap-2">
                  {activeTahunAjaran.nama}
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                    Aktif
                  </Badge>
                </span>
              ) : (
                <span className="text-muted-foreground italic text-xs">
                  Belum ada tahun ajaran aktif
                </span>
              )}
            </p>
          </div>

          {/* Semester for Date */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Semester
            </span>
            <p className="text-sm font-medium">
              {selectedSemester ? (
                <span>
                  {selectedSemester.nama}
                  <span className="block text-xs text-muted-foreground">
                    ({selectedSemester.tanggal_mulai.slice(0, 10)} s/d{" "}
                    {selectedSemester.tanggal_selesai.slice(0, 10)})
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground italic text-xs">
                  Tidak ada periode semester
                </span>
              )}
            </p>
          </div>

          {/* Holidays for Date */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Hari Libur
            </span>
            {selectedHolidays.length > 0 ? (
              <div className="space-y-2">
                {selectedHolidays.map((h) => (
                  <div
                    key={h.id_libur}
                    className="p-2.5 rounded-md bg-rose-500/10 border border-rose-200 dark:border-rose-900"
                  >
                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                      {h.keterangan}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Libur Sekolah / Cuti Bersama
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Bukan hari libur akademik
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
