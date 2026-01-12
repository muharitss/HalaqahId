import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserGraduate, faBook } from "@fortawesome/free-solid-svg-icons";

interface Santri {
  id_santri: number;
  nama: string;
  target: "RINGAN" | "SEDANG" | "INTENS" | "CUSTOM_KHUSUS";
  halaqah_id: number;
}

export function SantriStats({ santriList }: { santriList: Santri[] }) {
  const stats = [
    { label: "Total Santri", value: santriList.length, icon: faUsers, color: "text-primary", bg: "bg-primary/10" },
    { label: "Target Ringan", value: santriList.filter(s => s.target === "RINGAN").length, icon: faUserGraduate, color: "text-green-600", bg: "bg-green-100" },
    { label: "Target Sedang", value: santriList.filter(s => s.target === "SEDANG").length, icon: faBook, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "Target Khusus", value: santriList.filter(s => s.target === "CUSTOM_KHUSUS").length, icon: faUserGraduate, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <FontAwesomeIcon icon={stat.icon} className={stat.color} />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{stat.label}</p>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}