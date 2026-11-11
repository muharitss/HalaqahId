import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ClipboardCheck, Sparkles, Users } from "lucide-react";
import { useTerminology } from "@/hooks/useTerminology";
import { cn } from "@/lib/utils";

interface KepalaMuhafidzKpiProps {
  avgJuz: string;
  activeSetorCount: number;
  totalSantri: number;
  todaySetoranCount: number;
  todayAttendance: {
    hadir: number;
    total: number;
    percentage: number;
  };
  isLoading: boolean;
}

export function KepalaMuhafidzKpiCards({
  avgJuz,
  activeSetorCount,
  totalSantri,
  todaySetoranCount,
  todayAttendance,
  isLoading,
}: KepalaMuhafidzKpiProps) {
  const labelSantri = useTerminology("SANTRI");

  const cards = [
    {
      label: "Rata-Rata Hafalan",
      value: `Juz ${avgJuz}`,
      trend: `+${activeSetorCount} Aktif`,
      desc: `dari ${totalSantri} ${labelSantri.toLowerCase()}`,
      trendColor: "text-emerald-500",
      icon: BookOpen,
      gradientClass: "bg-gradient-to-tr from-slate-900 to-slate-700 shadow-slate-900/20",
    },
    {
      label: "Kehadiran Hari Ini",
      value: `${todayAttendance.percentage}%`,
      trend: `${todayAttendance.hadir} Hadir`,
      desc: `dari ${todayAttendance.total || totalSantri} ${labelSantri.toLowerCase()}`,
      trendColor: "text-emerald-500",
      icon: ClipboardCheck,
      gradientClass: "bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-emerald-500/25",
    },
    {
      label: "Setoran Hari Ini",
      value: `${todaySetoranCount}`,
      trend: "Hari Ini",
      desc: "riwayat hafalan masuk",
      trendColor: "text-amber-500",
      icon: Sparkles,
      gradientClass: "bg-gradient-to-tr from-amber-600 to-amber-400 shadow-amber-500/25",
    },
    {
      label: `Total ${labelSantri}`,
      value: `${totalSantri}`,
      trend: "100%",
      desc: "terdaftar di sistem",
      trendColor: "text-blue-500",
      icon: Users,
      gradientClass: "bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="shadow-sm border border-border/70 bg-card rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <CardHeader>
              <div className="flex items-center justify-between ">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground capitalize truncate leading-tight">
                    {card.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <h4 className="text-2xl font-bold tracking-tight text-foreground truncate">
                      {card.value}
                    </h4>
                  )}
                </div>
                <div
                >
                  <Icon className="text-primary" />
                </div>
              </div>
            </CardHeader>

            {/* <Separator/> */}

            <CardFooter className="pt-0">
              <p className="text-xs text-muted-foreground flex items-center truncate m-0">
                <span className={cn("font-bold shrink-0", card.trendColor)}>
                  {card.trend}
                </span>
                <span className="truncate ml-1">{card.desc}</span>
              </p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
