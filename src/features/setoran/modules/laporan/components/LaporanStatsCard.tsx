import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Star, Flame } from "lucide-react";

export interface LaporanStats {
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

export function LaporanStatsCard({ stats }: LaporanStatsCardProps) {
  const taqwimLabel =
    stats.rataRataTaqwim === 0
      ? "Sempurna"
      : stats.rataRataTaqwim <= 2
        ? "Baik (Itqan)"
        : "Perlu Perbaikan";

  const cards = [
    {
      title: "Total Setoran",
      value: stats.totalSetoran.toLocaleString("id-ID"),
      subtitle: stats.periodLabel,
      icon: BookOpen,
    },
    {
      title: "Santri Aktif",
      value: stats.totalSantriAktif.toLocaleString("id-ID"),
      subtitle: "Santri berpartisipasi",
      icon: Users,
    },
    {
      title: "Rata-rata Kelancaran",
      value: stats.rataRataTaqwim.toFixed(1),
      subtitle: taqwimLabel,
      icon: Star,
    },
    {
      title: "Kategori Dominan",
      value: stats.kategoriDominan || "—",
      subtitle: stats.kategoriDominan
        ? `${stats.distribusiKategori[stats.kategoriDominan] ?? 0} setoran`
        : "Tidak ada data",
      icon: Flame,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="py-3 md:py-4 gap-1 md:gap-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 px-3 md:px-4">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground truncate mr-2">
                {card.title}
              </CardTitle>
              <Icon className="h-3.5 w-3.5 md:h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="px-3 md:px-4">
              <div className="text-lg md:text-2xl font-bold tracking-tight truncate">
                {card.value}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 truncate">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

