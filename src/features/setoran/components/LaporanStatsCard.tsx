import { BookOpen, Users, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LaporanStats {
  totalSetoran: number;
  totalSantriAktif: number;
  rataRataTaqwim: number;
  kategoriDominan: string;
  distribusiKategori: Record<string, number>;
  distribusiHalaqah: Record<string, number>;
  periodLabel: string;
}

interface LaporanStatsCardProps {
  stats: LaporanStats;
}

const KATEGORI_COLOR: Record<string, string> = {
  HAFALAN: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  MURAJAAH: "bg-blue-500/10 text-blue-600 border-blue-200",
  ZIYADAH: "bg-violet-500/10 text-violet-600 border-violet-200",
  INTENS: "bg-amber-500/10 text-amber-600 border-amber-200",
  BACAAN: "bg-rose-500/10 text-rose-600 border-rose-200",
};

export function LaporanStatsCard({ stats }: LaporanStatsCardProps) {
  const taqwimColor =
    stats.rataRataTaqwim === 0
      ? "text-emerald-600"
      : stats.rataRataTaqwim <= 2
        ? "text-amber-600"
        : "text-rose-600";

  const taqwimLabel =
    stats.rataRataTaqwim === 0
      ? "Sempurna"
      : stats.rataRataTaqwim <= 2
        ? "Baik"
        : "Perlu Perbaikan";

  const cards = [
    {
      title: "Total Setoran",
      value: stats.totalSetoran.toLocaleString("id-ID"),
      subtitle: stats.periodLabel,
      icon: BookOpen,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      accent: "border-l-primary",
    },
    {
      title: "Santri Aktif",
      value: stats.totalSantriAktif.toLocaleString("id-ID"),
      subtitle: "santri dengan setoran",
      icon: Users,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      accent: "border-l-blue-500",
    },
    {
      title: "Rata-rata Taqwim",
      value: stats.rataRataTaqwim.toFixed(1),
      subtitle: taqwimLabel,
      icon: Target,
      iconBg:
        stats.rataRataTaqwim === 0
          ? "bg-emerald-500/10"
          : stats.rataRataTaqwim <= 2
            ? "bg-amber-500/10"
            : "bg-rose-500/10",
      iconColor: taqwimColor,
      accent:
        stats.rataRataTaqwim === 0
          ? "border-l-emerald-500"
          : stats.rataRataTaqwim <= 2
            ? "border-l-amber-500"
            : "border-l-rose-500",
      valueColor: taqwimColor,
    },
    {
      title: "Kategori Dominan",
      value: stats.kategoriDominan || "—",
      subtitle: stats.kategoriDominan
        ? `${stats.distribusiKategori[stats.kategoriDominan] ?? 0} catatan`
        : "Tidak ada data",
      icon: TrendingUp,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
      accent: "border-l-violet-500",
      isBadge: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`border-l-4 ${card.accent} shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1">
                    {card.title}
                  </p>
                  {card.isBadge && card.value !== "—" ? (
                    <Badge
                      className={`text-sm font-bold px-2 py-0.5 border ${KATEGORI_COLOR[card.value] ?? "bg-muted text-muted-foreground"}`}
                      variant="outline"
                    >
                      {card.value}
                    </Badge>
                  ) : (
                    <p
                      className={`text-2xl font-extrabold tracking-tight ${card.valueColor ?? "text-foreground"}`}
                    >
                      {card.value}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {card.subtitle}
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 h-9 w-9 rounded-lg ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export type { LaporanStats };
