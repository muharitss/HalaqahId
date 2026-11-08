import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ClipboardCheck, Sparkles, Users } from "lucide-react";
import { useTerminology } from "@/hooks/useTerminology";

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
      label: "Progress Hafalan Rata-Rata",
      value: `Juz ${avgJuz}`,
      desc: `${activeSetorCount} dari ${totalSantri} ${labelSantri.toLowerCase()} aktif setor`,
      icon: BookOpen,
      color: "text-primary",
    },
    {
      label: "Absensi Hari Ini",
      value: `${todayAttendance.percentage}%`,
      desc: `${todayAttendance.hadir} dari ${todayAttendance.total || totalSantri} ${labelSantri.toLowerCase()} hadir`,
      icon: ClipboardCheck,
      color: "text-emerald-500",
    },
    {
      label: "Setoran Hari Ini",
      value: `${todaySetoranCount}`,
      desc: `Total riwayat hafalan masuk hari ini`,
      icon: Sparkles,
      color: "text-amber-500",
    },
    {
      label: `Total ${labelSantri}`,
      value: `${totalSantri}`,
      desc: `Terdaftar aktif di sistem sekolah`,
      icon: Users,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20 mt-1" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-1 truncate">
                {card.desc}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
