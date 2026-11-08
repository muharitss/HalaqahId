import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { School, Users, Building2, UserCheck } from "lucide-react";

interface KpiData {
  totalTenant?: number;
  totalSekolah: number;
  totalSantri: number;
  totalHalaqah?: number;
  totalUser: number;
}

interface SuperadminKpiCardsProps {
  kpi: KpiData;
  isLoading: boolean;
}

const cards = [
  {
    key: "totalTenant" as const,
    label: "Jumlah Tenant",
    desc: "Institusi / Organisasi",
    icon: Building2,
  },
  {
    key: "totalSekolah" as const,
    label: "Total Sekolah",
    desc: "Unit sekolah terdaftar",
    icon: School,
  },
  {
    key: "totalSantri" as const,
    label: "Total Santri",
    desc: "Santri seluruh sekolah",
    icon: Users,
  },
  {
    key: "totalUser" as const,
    label: "Total Pengguna",
    desc: "Admin, Muhafiz & Staff",
    icon: UserCheck,
  },
];

export function SuperadminKpiCards({ kpi, isLoading }: SuperadminKpiCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, desc, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <div className="text-2xl font-bold">
                {(kpi[key] ?? 0).toLocaleString("id-ID")}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
