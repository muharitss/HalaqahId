import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Status = "hadir" | "sakit" | "izin" | "terlambat" | "absen";

interface Halaqah {
  id: number;
  nama: string;
  muhafidz: string;
}

interface Santri {
  id: number;
  nama: string;
  halaqahId: number;
}

interface Absensi {
  santriId: number;
  status: Status;
  tanggal: Date;
}

interface Setoran {
  id: number;
  santriId: number;
  surah: string;
  ayat_mulai: number;
  ayat_selesai: number;
  nilai: number;
  catatan: string;
  tanggal: Date;
}

export default function AbsensiPage() {
  const [_halaqah, _setHalaqah] = useState<Halaqah>({
    id: 1,
    nama: "Halaqah A",
    muhafidz: "Ust. Ahmad",
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isPastDate, setIsPastDate] = useState(false);

  const [santri, _setSantri] = useState<Santri[]>([
    { id: 1, nama: "Ahmad", halaqahId: 1 },
    { id: 2, nama: "Burhan", halaqahId: 1 },
    { id: 3, nama: "Cahya", halaqahId: 1 },
    { id: 4, nama: "Dafa", halaqahId: 1 },
    { id: 5, nama: "Ehsan", halaqahId: 1 },
    { id: 6, nama: "Fahri", halaqahId: 1 },
    { id: 7, nama: "Gamal", halaqahId: 1 },
    { id: 8, nama: "Hamzah", halaqahId: 1 },
  ]);

  // Data absensi dengan tanggal
  const [absensi, setAbsensi] = useState<Absensi[]>([
    { 
      santriId: 1, 
      status: "izin", 
      tanggal: new Date(2026, 0, 14) // 14 Januari 2026
    },
    { 
      santriId: 2, 
      status: "hadir", 
      tanggal: new Date(2026, 0, 14) 
    },
    { 
      santriId: 3, 
      status: "izin", 
      tanggal: new Date(2026, 0, 14) 
    },
    { 
      santriId: 4, 
      status: "absen", 
      tanggal: new Date(2026, 0, 14) 
    },
    { 
      santriId: 5, 
      status: "absen", 
      tanggal: new Date(2026, 0, 14) 
    },
    { 
      santriId: 6, 
      status: "absen", 
      tanggal: new Date(2026, 0, 14) 
    },
    { 
      santriId: 7, 
      status: "hadir", 
      tanggal: new Date(2026, 0, 14) 
    },
    { 
      santriId: 8, 
      status: "sakit", 
      tanggal: new Date(2026, 0, 14) 
    },
  ]);

  // Data mock setoran
  const [setoran, _setSetoran] = useState<Setoran[]>([
    { 
      id: 1, 
      santriId: 1, 
      surah: "Al-Baqarah", 
      ayat_mulai: 1, 
      ayat_selesai: 10, 
      nilai: 90, 
      catatan: "Tajwid sudah bagus",
      tanggal: new Date(2026, 0, 14)
    },
    { 
      id: 2, 
      santriId: 1, 
      surah: "Al-Baqarah", 
      ayat_mulai: 11, 
      ayat_selesai: 15, 
      nilai: 85, 
      catatan: "Perbaikan makhraj",
      tanggal: new Date(2026, 0, 14)
    },
    { 
      id: 3, 
      santriId: 2, 
      surah: "Al-Kahf", 
      ayat_mulai: 1, 
      ayat_selesai: 10, 
      nilai: 88, 
      catatan: "Perlu pengulangan",
      tanggal: new Date(2026, 0, 14)
    },
    { 
      id: 4, 
      santriId: 3, 
      surah: "An-Naba", 
      ayat_mulai: 1, 
      ayat_selesai: 40, 
      nilai: 85, 
      catatan: "Perlu perbaikan makhraj",
      tanggal: new Date(2026, 0, 14)
    },
  ]);

  const handleStatusChange = (santriId: number, status: Status) => {
    setAbsensi((prev) => {
      const exists = prev.find((a) => 
        a.santriId === santriId && 
        a.tanggal.toDateString() === selectedDate.toDateString()
      );

      if (exists) {
        return prev.map((a) =>
          a.santriId === santriId && a.tanggal.toDateString() === selectedDate.toDateString() 
            ? { ...a, status } 
            : a
        );
      }

      return [...prev, { 
        santriId, 
        status, 
        tanggal: new Date(selectedDate) 
      }];
    });
  };

  const handleSubmit = () => {
    console.log("Payload ke backend:", {
      tanggal: selectedDate,
      absensi: absensi.filter(a => 
        a.tanggal.toDateString() === selectedDate.toDateString()
      ),
    });
    
    alert(`Absensi untuk tanggal ${format(selectedDate, "dd MMMM yyyy", { locale: id })} berhasil disimpan`);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);
      setIsPastDate(selected < today);
    }
  };

  // Ambil setoran berdasarkan tanggal yang dipilih
  const getSetoranByDate = (santriId: number, date: Date): Setoran[] => {
    const targetDate = new Date(date).toDateString();
    return setoran.filter(s => 
      s.santriId === santriId && 
      new Date(s.tanggal).toDateString() === targetDate
    );
  };

  // Ambil setoran terbaru
  const getLatestSetoran = (santriId: number): Setoran | undefined => {
    const santriSetoran = setoran
      .filter(s => s.santriId === santriId)
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    
    return santriSetoran[0];
  };

  // Data rows berdasarkan tanggal yang dipilih
  const rows = santri.map((s) => {
    const data = absensi.find((a) => 
      a.santriId === s.id && 
      a.tanggal.toDateString() === selectedDate.toDateString()
    );
    
    const setoranHariIni = getSetoranByDate(s.id, selectedDate);
    const latestSetoran = getLatestSetoran(s.id);
    const sudahSetorHariIni = setoranHariIni.length > 0;

    return {
      santriId: s.id,
      namaSantri: s.nama,
      status: data?.status ?? "absen",
      sudahSetor: sudahSetorHariIni,
      setoranHariIni: setoranHariIni,
      setoranTerakhir: latestSetoran,
      totalSetoranHariIni: setoranHariIni.length,
    };
  });

  // Fungsi untuk mendapatkan warna badge berdasarkan status
  const getStatusBadgeColor = (status: Status): string => {
    switch (status) {
      case "hadir": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      case "izin": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "sakit": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
      case "terlambat": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
      case "absen": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
    }
  };

  // Fungsi untuk mendapatkan dot color
  const getDotColor = (status: Status): string => {
    switch (status) {
      case "hadir": return "bg-green-500";
      case "izin": return "bg-blue-500";
      case "sakit": return "bg-yellow-500";
      case "terlambat": return "bg-orange-500";
      case "absen": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                Absensi
                {isPastDate && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400">
                    Mengisi untuk tanggal lalu
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-3 mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <svg 
                        className="mr-2 h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      {selectedDate ? (
                        format(selectedDate, "EEEE, dd MMMM yyyy", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <CardDescription>
                  Pilih tanggal untuk mengisi atau melihat absensi
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isPastDate && (
                <Badge variant="secondary" className="text-xs">
                  Mode Edit Tanggal Lalu
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Absensi */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[50px] font-bold">#</TableHead>
                  <TableHead className="font-bold">Nama Santri</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Info Setoran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, _index) => {
                  const statusText = row.status.charAt(0).toUpperCase() + row.status.slice(1);
                  
                  return (
                    <TableRow key={row.santriId}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <div className={`h-2 w-2 rounded-full ${getDotColor(row.status)}`} />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {row.namaSantri}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${getStatusBadgeColor(row.status)} border`}
                          >
                            <div className="flex items-center gap-1.5">
                              <div className={`h-1.5 w-1.5 rounded-full ${getDotColor(row.status)}`} />
                              {statusText}
                            </div>
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 p-0 hover:bg-muted"
                              >
                                <svg 
                                  className="h-3.5 w-3.5" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M19 9l-7 7-7-7" 
                                  />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                              <DropdownMenuItem onClick={() => handleStatusChange(row.santriId, "hadir")}>
                                <div className="flex items-center gap-2 w-full">
                                  <div className="h-2 w-2 rounded-full bg-green-500" />
                                  <span>Hadir</span>
                                  {row.status === "hadir" && (
                                    <svg 
                                      className="h-3.5 w-3.5 ml-auto text-green-600" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={3} 
                                        d="M5 13l4 4L19 7" 
                                      />
                                    </svg>
                                  )}
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(row.santriId, "izin")}>
                                <div className="flex items-center gap-2 w-full">
                                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                                  <span>Izin</span>
                                  {row.status === "izin" && (
                                    <svg 
                                      className="h-3.5 w-3.5 ml-auto text-blue-600" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={3} 
                                        d="M5 13l4 4L19 7" 
                                      />
                                    </svg>
                                  )}
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(row.santriId, "sakit")}>
                                <div className="flex items-center gap-2 w-full">
                                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                  <span>Sakit</span>
                                  {row.status === "sakit" && (
                                    <svg 
                                      className="h-3.5 w-3.5 ml-auto text-yellow-600" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={3} 
                                        d="M5 13l4 4L19 7" 
                                      />
                                    </svg>
                                  )}
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(row.santriId, "terlambat")}>
                                <div className="flex items-center gap-2 w-full">
                                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                                  <span>Terlambat</span>
                                  {row.status === "terlambat" && (
                                    <svg 
                                      className="h-3.5 w-3.5 ml-auto text-orange-600" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={3} 
                                        d="M5 13l4 4L19 7" 
                                      />
                                    </svg>
                                  )}
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(row.santriId, "absen")}>
                                <div className="flex items-center gap-2 w-full">
                                  <div className="h-2 w-2 rounded-full bg-red-500" />
                                  <span>Absen</span>
                                  {row.status === "absen" && (
                                    <svg 
                                      className="h-3.5 w-3.5 ml-auto text-red-600" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={3} 
                                        d="M5 13l4 4L19 7" 
                                      />
                                    </svg>
                                  )}
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {row.sudahSetor ? (
                            <>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium">Sudah Setor</span>
                              </div>
                              {row.setoranHariIni.map((setor) => (
                                <div key={setor.id} className="ml-4 text-sm">
                                  <span className="font-medium">{setor.surah}</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    (Ayat {setor.ayat_mulai}-{setor.ayat_selesai})
                                  </span>
                                </div>
                              ))}
                            </>
                          ) : row.setoranTerakhir ? (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Terakhir: </span>
                              <span className="font-medium">{row.setoranTerakhir.surah}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                (Ayat {row.setoranTerakhir.ayat_mulai}-{row.setoranTerakhir.ayat_selesai})
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Belum ada setoran</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Menampilkan absensi untuk <span className="font-medium text-foreground">
                {format(selectedDate, "dd MMMM yyyy", { locale: id })}
              </span>
              {isPastDate && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">(Tanggal lalu)</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const confirmed = confirm(`Reset semua status untuk tanggal ${format(selectedDate, "dd MMMM yyyy", { locale: id })}?`);
                  if (confirmed) {
                    const updatedAbsensi = absensi.filter(a => 
                      a.tanggal.toDateString() !== selectedDate.toDateString()
                    );
                    
                    const resetAbsensi = rows.map(row => ({
                      santriId: row.santriId,
                      status: "absen" as Status,
                      tanggal: new Date(selectedDate)
                    }));
                    
                    setAbsensi([...updatedAbsensi, ...resetAbsensi]);
                  }
                }}
              >
                Reset Absensi
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Kembali ke Hari Ini
              </Button>
              <Button onClick={handleSubmit} size="sm">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}