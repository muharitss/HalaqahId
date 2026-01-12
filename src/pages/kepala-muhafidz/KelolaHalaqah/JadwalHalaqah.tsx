import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users, User } from "lucide-react";

const DAYS = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
const DAY_LABELS = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu"
};

// Mock data jadwal (tanpa level)
const mockJadwal = [
  {
    id: 1,
    nama_halaqah: "Halaqah Al-Fatihah",
    kode: "HQA-001",
    hari: "senin",
    jam_mulai: "08:00",
    jam_selesai: "10:00",
    lokasi: "Masjid Al-Ikhlas",
    muhafidz: "Ust. Ahmad Hidayat",
    jumlah_santri: 15,
    kapasitas: 20,
    status: "aktif"
  },
  {
    id: 2,
    nama_halaqah: "Halaqah Al-Baqarah",
    kode: "HQA-002",
    hari: "senin",
    jam_mulai: "10:00",
    jam_selesai: "12:00",
    lokasi: "Ruang 101",
    muhafidz: "Ust. Bambang Prasetyo",
    jumlah_santri: 18,
    kapasitas: 20,
    status: "aktif"
  },
  {
    id: 3,
    nama_halaqah: "Halaqah Ali Imran",
    kode: "HQA-003",
    hari: "selasa",
    jam_mulai: "14:00",
    jam_selesai: "16:00",
    lokasi: "Masjid Al-Falah",
    muhafidz: "Ust. Cahyo Nugroho",
    jumlah_santri: 12,
    kapasitas: 15,
    status: "penuh"
  },
  {
    id: 4,
    nama_halaqah: "Halaqah An-Nisa",
    kode: "HQA-004",
    hari: "rabu",
    jam_mulai: "09:00",
    jam_selesai: "11:00",
    lokasi: "Ruang 102",
    muhafidz: "Ust. Dani Setiawan",
    jumlah_santri: 16,
    kapasitas: 20,
    status: "aktif"
  }
];

export default function JadwalHalaqah() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      aktif: "border-l-green-500 bg-green-50 dark:bg-green-900/20",
      penuh: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20",
      nonaktif: "border-l-gray-500 bg-gray-50 dark:bg-gray-900/20"
    };
    return colors[status] || "border-l-gray-500 bg-gray-50";
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      aktif: { label: "Aktif", color: "bg-green-100 text-green-800" },
      penuh: { label: "Penuh", color: "bg-blue-100 text-blue-800" },
      nonaktif: { label: "Nonaktif", color: "bg-gray-100 text-gray-800" }
    };
    const cfg = config[status];
    return cfg ? <Badge className={`${cfg.color} text-xs`}>{cfg.label}</Badge> : null;
  };

  // Filter jadwal berdasarkan hari yang dipilih
  const filteredJadwal = selectedDay
    ? mockJadwal.filter(j => j.hari === selectedDay)
    : mockJadwal;

  // Hitung statistik per hari
//   const hariStats = DAYS.reduce((acc, day) => {
//     const count = mockJadwal.filter(j => j.hari === day).length;
//     return { ...acc, [day]: count };
//   }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header dengan navigasi minggu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-xl font-bold dark:text-white">Jadwal Halaqah</h2>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Lihat jadwal pertemuan halaqah berdasarkan hari
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Minggu ke-{currentWeek + 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(prev => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant={selectedDay ? "outline" : "default"}
            onClick={() => setSelectedDay(null)}
            size="sm"
          >
            Semua Hari
          </Button>
        </div>
      </div>

      {/* Grid Hari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
        {DAYS.map((day) => {
          const dayJadwal = mockJadwal.filter(j => j.hari === day);
          const isSelected = selectedDay === day;
          
          return (
            <Card 
              key={day}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedDay(isSelected ? null : day)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <span className="font-semibold text-lg">
                    {DAY_LABELS[day as keyof typeof DAY_LABELS]}
                  </span>
                  <div className="mt-2">
                    <Badge 
                      variant={dayJadwal.length > 0 ? "default" : "outline"}
                      className={dayJadwal.length > 0 ? "bg-primary" : ""}
                    >
                      {dayJadwal.length} Halaqah
                    </Badge>
                  </div>
                  {dayJadwal.length > 0 && (
                    <div className="mt-3 space-y-1 w-full">
                      {dayJadwal.slice(0, 2).map((j) => (
                        <div 
                          key={j.id}
                          className={`text-xs p-2 rounded border-l-4 ${getStatusColor(j.status)}`}
                        >
                          <p className="font-medium truncate">{j.kode}</p>
                          <p className="text-gray-600 dark:text-gray-400">{j.jam_mulai}</p>
                        </div>
                      ))}
                      {dayJadwal.length > 2 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{dayJadwal.length - 2} lainnya
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistik Ringkas */}
      <Card className="bg-accent/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {mockJadwal.length}
              </div>
              <div className="text-sm text-gray-500">Total Halaqah</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockJadwal.filter(j => j.status === "aktif").length}
              </div>
              <div className="text-sm text-gray-500">Halaqah Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mockJadwal.filter(j => j.status === "penuh").length}
              </div>
              <div className="text-sm text-gray-500">Halaqah Penuh</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {mockJadwal.reduce((sum, j) => sum + j.jumlah_santri, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Santri</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Jadwal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {selectedDay 
              ? `Jadwal Hari ${DAY_LABELS[selectedDay as keyof typeof DAY_LABELS]}` 
              : "Semua Jadwal Halaqah"}
            <Badge variant="outline" className="ml-2">
              {filteredJadwal.length} Halaqah
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredJadwal.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Tidak ada jadwal halaqah</p>
              <p className="text-sm text-gray-400">Pilih hari lain atau buat halaqah baru</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJadwal.map((jadwal) => (
                <Card 
                  key={jadwal.id}
                  className={`border-l-4 overflow-hidden ${getStatusColor(jadwal.status)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{jadwal.nama_halaqah}</h3>
                          <span className="font-mono text-sm text-gray-500">
                            {jadwal.kode}
                          </span>
                          {getStatusBadge(jadwal.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{jadwal.jam_mulai} - {jadwal.jam_selesai}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{jadwal.lokasi}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>
                              {jadwal.jumlah_santri}/{jadwal.kapasitas} santri
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{jadwal.muhafidz}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="font-medium">{jadwal.muhafidz}</div>
                          <div className="text-sm text-gray-500">Muhafidz</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                    
                    {/* Progress bar untuk kapasitas */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Kapasitas</span>
                        <span>{Math.round((jadwal.jumlah_santri / jadwal.kapasitas) * 100)}% terisi</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            jadwal.status === "penuh" 
                              ? "bg-blue-500" 
                              : jadwal.jumlah_santri / jadwal.kapasitas > 0.8
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${(jadwal.jumlah_santri / jadwal.kapasitas) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-accent/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium">Legenda Status:</span>
            {[
              { status: "aktif", label: "Aktif", color: "bg-green-500" },
              { status: "penuh", label: "Penuh", color: "bg-blue-500" },
              { status: "nonaktif", label: "Nonaktif", color: "bg-gray-500" }
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}