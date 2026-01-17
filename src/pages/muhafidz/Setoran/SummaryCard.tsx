import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryProps {
  total: number;
  santri: number;
  rataRata: string;
}

export function SummaryCards({ total, santri, rataRata }: SummaryProps) {
  const stats = [
    { label: "Total Setoran", value: total, color: "text-blue-600" },
    { label: "Total Santri", value: santri, color: "text-emerald-600" },
    { label: "Rata-rata Nilai", value: rataRata, color: "text-amber-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}