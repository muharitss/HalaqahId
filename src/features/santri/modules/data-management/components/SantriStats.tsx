import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserGraduate, faBook, faBullseye } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Santri } from "@/features/santri/types";

export function SantriStats({ santriList }: { santriList: Santri[] }) {
  const withTarget = santriList.filter((s) => s.id_target !== null && s.id_target !== undefined).length;
  const noTarget = santriList.length - withTarget;
  const percent = santriList.length > 0 ? Math.round((withTarget / santriList.length) * 100) : 0;

  const stats = [
    { 
      label: "Total Santri", 
      value: santriList.length, 
      icon: faUsers,
      sub: "Terdaftar aktif",
    },
    { 
      label: "Memiliki Target", 
      value: withTarget, 
      icon: faBullseye,
      sub: "Mengikuti kurikulum",
    },
    { 
      label: "Tanpa Target", 
      value: noTarget, 
      icon: faBook,
      sub: "Belajar mandiri",
    },
    { 
      label: "Rasio Target", 
      value: `${percent}%`, 
      icon: faUserGraduate, 
      sub: "Santri terarah",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <FontAwesomeIcon 
              icon={stat.icon} 
              className="h-4 w-4 text-muted-foreground" 
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
