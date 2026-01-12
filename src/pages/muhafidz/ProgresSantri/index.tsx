import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, 
  faCalendarAlt,
  faUserGraduate,
  faCheckCircle,
  faClock,
  faBookOpen
} from "@fortawesome/free-solid-svg-icons";

// Data dummy untuk progres santri
const dummyProgres = [
  { 
    id: 1, 
    nama: "Ahmad Farhan", 
    target: "SEDANG", 
    capaian: 75, 
    status: "On Track",
    terakhirSetor: "2 hari lalu",
    totalAyat: 150
  },
  { 
    id: 2, 
    nama: "Zaid Ramadhan", 
    target: "INTENS", 
    capaian: 90, 
    status: "Excellent",
    terakhirSetor: "Kemarin",
    totalAyat: 280
  },
  { 
    id: 3, 
    nama: "Umar Mukhtar", 
    target: "RINGAN", 
    capaian: 60, 
    status: "Perlu Bimbingan",
    terakhirSetor: "3 hari lalu",
    totalAyat: 85
  },
  { 
    id: 4, 
    nama: "Abdullah Haikal", 
    target: "CUSTOM_KHUSUS", 
    capaian: 85, 
    status: "On Track",
    terakhirSetor: "Kemarin",
    totalAyat: 120
  },
];

export default function ProgresSantriPage() {
  const [filterStatus, setFilterStatus] = useState("semua");
  const [filterTarget, setFilterTarget] = useState("semua");

  // Filter progres berdasarkan status dan target
  const filteredProgres = dummyProgres.filter(progres => {
    const statusMatch = filterStatus === "semua" || progres.status === filterStatus;
    const targetMatch = filterTarget === "semua" || progres.target === filterTarget;
    return statusMatch && targetMatch;
  });

  // Warna berdasarkan status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300";
      case "On Track": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300";
      case "Perlu Bimbingan": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Warna bar progres
  const getProgresColor = (capaian: number) => {
    if (capaian >= 80) return "bg-green-500";
    if (capaian >= 60) return "bg-blue-500";
    return "bg-orange-500";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col text-left">
        <h2 className="text-2xl font-bold dark:text-white">Progres Santri</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
          Pantau perkembangan hafalan santri
        </p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 dark:text-white">Filter Status</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="On Track">On Track</SelectItem>
              <SelectItem value="Perlu Bimbingan">Perlu Bimbingan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 dark:text-white">Filter Target</label>
          <Select value={filterTarget} onValueChange={setFilterTarget}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Target</SelectItem>
              <SelectItem value="RINGAN">Ringan</SelectItem>
              <SelectItem value="SEDANG">Sedang</SelectItem>
              <SelectItem value="INTENS">Intens</SelectItem>
              <SelectItem value="CUSTOM_KHUSUS">Khusus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" className="w-full md:w-auto">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Bulan Ini
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Rata-rata Capaian</p>
              <p className="text-2xl font-bold dark:text-white">77.5%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Total Ayat</p>
              <p className="text-2xl font-bold dark:text-white">635</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faUserGraduate} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Santri Aktif</p>
              <p className="text-2xl font-bold dark:text-white">{dummyProgres.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Progres */}
      <div className="rounded-xl border border-border bg-card dark:bg-surface-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border dark:border-border-dark">
          <h3 className="font-semibold text-lg dark:text-white">Detail Progres Santri</h3>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Menampilkan {filteredProgres.length} dari {dummyProgres.length} santri
          </p>
        </div>

        {filteredProgres.length === 0 ? (
          <div className="p-12 text-center">
            <FontAwesomeIcon icon={faChartLine} className="text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4" />
            <h4 className="font-medium dark:text-white mb-2">Tidak ada data</h4>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              Tidak ada progres yang sesuai dengan filter
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/30 dark:bg-background-dark/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">Nama Santri</th>
                  <th className="px-6 py-4 text-left">Target</th>
                  <th className="px-6 py-4 text-left">Progres</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Terakhir Setor</th>
                  <th className="px-6 py-4 text-left">Total Ayat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredProgres.map((progres) => (
                  <tr 
                    key={progres.id} 
                    className="hover:bg-accent/5 dark:hover:bg-background-dark/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FontAwesomeIcon icon={faUserGraduate} className="text-primary text-sm" />
                        </div>
                        <span className="font-medium dark:text-white">{progres.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-900/30 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {progres.target}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{progres.capaian}%</span>
                          <span>{progres.totalAyat} ayat</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getProgresColor(progres.capaian)}`}
                            style={{ width: `${progres.capaian}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(progres.status)}`}>
                        {progres.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark">
                        <FontAwesomeIcon icon={faClock} className="text-sm" />
                        {progres.terakhirSetor}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium dark:text-white">{progres.totalAyat}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend Keterangan */}
      <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
        <h4 className="font-semibold dark:text-white mb-3">Keterangan Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm dark:text-white">Excellent (≥80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm dark:text-white">On Track (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-sm dark:text-white">Perlu Bimbingan (60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}