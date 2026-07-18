import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isSameMonth, isSameDay, parseISO, subMonths, addMonths } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { ExamSchedule } from "@/features/setoran/api/ujian-api";

interface ExamCalendarProps {
  currentMonth: Date;
  setCurrentMonth: (val: Date | ((prev: Date) => Date)) => void;
  isLoadingSchedules: boolean;
  schedules: ExamSchedule[];
  calendarDays: Date[];
  handleDayClick: (day: Date) => void;
  handleScheduleClick: (schedule: ExamSchedule, e: React.MouseEvent) => void;
}

export function ExamCalendar({
  currentMonth,
  setCurrentMonth,
  isLoadingSchedules,
  schedules,
  calendarDays,
  handleDayClick,
  handleScheduleClick,
}: ExamCalendarProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-base font-extrabold text-foreground min-w-[140px] text-center capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: idLocale })}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">
          {isLoadingSchedules
            ? "Memuat jadwal ujian..."
            : "* Klik sel tanggal di kalender untuk menjadwalkan ujian baru"}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-muted-foreground pb-2 border-b">
        <div>Senin</div>
        <div>Selasa</div>
        <div>Rabu</div>
        <div>Kamis</div>
        <div>Jumat</div>
        <div>Sabtu</div>
        <div>Minggu</div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 min-h-[480px]">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const daySchedules = schedules.filter((s) => {
            const sDate = parseISO(s.tanggal_ujian);
            return isSameDay(day, sDate);
          });

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`border rounded-lg p-2 flex flex-col justify-between cursor-pointer transition-all hover:bg-muted/10 min-h-[85px] group ${
                isCurrentMonth
                  ? "bg-card"
                  : "bg-muted/20 text-muted-foreground opacity-60"
              } ${isToday ? "ring-2 ring-primary border-transparent" : "border-border"}`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-[10px] font-black ${isToday ? "text-primary font-black" : ""}`}
                >
                  {format(day, "d")}
                </span>
                {daySchedules.length > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>

              <div className="space-y-1 mt-1.5 overflow-hidden flex-1 flex flex-col justify-end">
                {daySchedules.slice(0, 2).map((sched) => {
                  let statusBadge =
                    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200";
                  if (sched.status === "AKTIF")
                    statusBadge =
                      "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200";
                  if (sched.status === "SELESAI")
                    statusBadge =
                      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200";
                  if (sched.status === "DIBATALKAN")
                    statusBadge =
                      "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200";

                  return (
                    <div
                      key={sched.id_jadwal}
                      onClick={(e) => handleScheduleClick(sched, e)}
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded border leading-tight truncate text-left cursor-pointer hover:opacity-85 ${statusBadge}`}
                      title={`${sched.judul_jadwal} (${sched.status})`}
                    >
                      {sched.judul_jadwal}
                    </div>
                  );
                })}
                {daySchedules.length > 2 && (
                  <div className="text-[7px] text-muted-foreground text-center font-extrabold">
                    +{daySchedules.length - 2} Lainnya
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
