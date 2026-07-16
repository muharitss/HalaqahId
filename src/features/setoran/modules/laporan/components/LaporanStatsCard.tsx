import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    },
    {
      title: "Santri Aktif",
      value: stats.totalSantriAktif.toLocaleString("id-ID"),
      subtitle: "Santri berpartisipasi",
    },
    {
      title: "Rata-rata Kelancaran",
      value: stats.rataRataTaqwim.toFixed(1),
      subtitle: taqwimLabel,
    },
    {
      title: "Kategori Dominan",
      value: stats.kategoriDominan || "—",
      subtitle: stats.kategoriDominan
        ? `${stats.distribusiKategori[stats.kategoriDominan] ?? 0} setoran`
        : "Tidak ada data",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
