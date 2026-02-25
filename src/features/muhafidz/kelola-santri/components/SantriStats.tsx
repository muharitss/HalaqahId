import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserGraduate, faBook, faBullseye } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Santri } from "../types";

export function SantriStats({ santriList }: { santriList: Santri[] }) {
  const stats = [
    { 
      label: "Total Santri", 
      value: santriList.length, 
      icon: faUsers,
    },
    { 
      label: "Target Ringan", 
      value: santriList.filter(s => s.target === "RINGAN").length, 
      icon: faUserGraduate,
    },
    { 
      label: "Target Sedang", 
      value: santriList.filter(s => s.target === "SEDANG").length, 
      icon: faBook,
    },
    { 
      label: "Target Intense", 
      value: santriList.filter(s => s.target === "INTENSE").length, 
      icon: faBullseye, 
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
              Aktif dalam sistem
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}