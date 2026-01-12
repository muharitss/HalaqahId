import { useState } from "react";
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
}

// Tipe data Setoran
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

  const [absensi, setAbsensi] = useState<Absensi[]>([
    { santriId: 1, status: "hadir" },
    { santriId: 2, status: "sakit" },
    { santriId: 3, status: "izin" },
    { santriId: 4, status: "absen" },
    { santriId: 5, status: "absen" },
    { santriId: 6, status: "absen" },
    { santriId: 7, status: "hadir" },
    { santriId: 8, status: "sakit" },
  ]);

  // Data mock setoran (dari page Setoran)
  const [setoran, _setSetoran] = useState<Setoran[]>([
    { 
      id: 1, 
      santriId: 1, 
      surah: "Al-Baqarah", 
      ayat_mulai: 1, 
      ayat_selesai: 10, 
      nilai: 90, 
      catatan: "Tajwid sudah bagus",
      tanggal: new Date() 
    },
    { 
      id: 2, 
      santriId: 3, 
      surah: "An-Naba", 
      ayat_mulai: 1, 
      ayat_selesai: 40, 
      nilai: 85, 
      catatan: "Perlu perbaikan makhraj",
      tanggal: new Date() 
    },
    { 
      id: 3, 
      santriId: 7, 
      surah: "Al-Fatihah", 
      ayat_mulai: 1, 
      ayat_selesai: 7, 
      nilai: 95, 
      catatan: "Sangat lancar",
      tanggal: new Date() 
    },
    { 
      id: 4, 
      santriId: 1, 
      surah: "Al-Baqarah", 
      ayat_mulai: 11, 
      ayat_selesai: 15, 
      nilai: 92, 
      catatan: "Hafalan mantap",
      tanggal: new Date() 
    },
    { 
      id: 5, 
      santriId: 2, 
      surah: "Al-Kahf", 
      ayat_mulai: 1, 
      ayat_selesai: 10, 
      nilai: 88, 
      catatan: "Perlu pengulangan",
      tanggal: new Date() 
    },
  ]);

  const handleStatusChange = (santriId: number, status: Status) => {
    setAbsensi((prev) => {
      const exists = prev.find((a) => a.santriId === santriId);

      if (exists) {
        return prev.map((a) =>
          a.santriId === santriId ? { ...a, status } : a
        );
      }

      return [...prev, { santriId, status }];
    });
  };

  const handleSubmit = () => {
    console.log("Payload ke backend:", {
      tanggal: new Date(),
      absensi,
    });

    alert("Absensi berhasil disimpan");
  };

  // Fungsi untuk mendapatkan setoran hari ini berdasarkan santriId
  const getTodaySetoran = (santriId: number): Setoran[] => {
    const today = new Date().toDateString();
    return setoran.filter(s => 
      s.santriId === santriId && 
      new Date(s.tanggal).toDateString() === today
    );
  };

  // Fungsi untuk mendapatkan setoran terbaru (dari hari ini atau sebelumnya)
  const getLatestSetoran = (santriId: number): Setoran | undefined => {
    const santriSetoran = setoran
      .filter(s => s.santriId === santriId)
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    
    return santriSetoran[0];
  };

  const rows = santri.map((s) => {
    const data = absensi.find((a) => a.santriId === s.id);
    const todaySetoran = getTodaySetoran(s.id);
    const latestSetoran = getLatestSetoran(s.id);
    const sudahSetorHariIni = todaySetoran.length > 0;

    return {
      santriId: s.id,
      namaSantri: s.nama,
      status: data?.status ?? "absen",
      sudahSetor: sudahSetorHariIni,
      setoranHariIni: todaySetoran,
      setoranTerakhir: latestSetoran,
      totalSetoranHariIni: todaySetoran.length,
    };
  });

  // Summary untuk kehadiran
  const summaryKehadiran = {
    total: rows.length,
    hadir: rows.filter((r) => r.status === "hadir").length,
    izin: rows.filter((r) => r.status === "izin").length,
    sakit: rows.filter((r) => r.status === "sakit").length,
    terlambat: rows.filter((r) => r.status === "terlambat").length,
    absen: rows.filter((r) => r.status === "absen").length,
  };

  // Summary untuk setoran
  const summarySetoran = {
    totalSetoran: rows.reduce((acc, row) => acc + row.totalSetoranHariIni, 0),
    santriSudahSetor: rows.filter(r => r.sudahSetor).length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col text-left">
        <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          Absensi Hari Ini
        </h2>
        <p className="text-muted-foreground dark:text-text-secondary-dark text-sm">
          {new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-border dark:border-border-dark bg-card dark:bg-surface-dark shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-accent/50 dark:bg-background-dark/50 text-foreground dark:text-foreground-dark">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Santri</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Info Setoran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border-dark">
              {rows.map((row) => {
                const statusColors = {
                  hadir: "text-green-600 dark:text-green-400",
                  sakit: "text-yellow-600 dark:text-yellow-400",
                  izin: "text-blue-600 dark:text-blue-400",
                  terlambat: "text-orange-600 dark:text-orange-400",
                  absen: "text-red-600 dark:text-red-400",
                };

                const statusText = {
                  hadir: "Hadir",
                  sakit: "Sakit",
                  izin: "Izin",
                  terlambat: "Terlambat",
                  absen: "Absen",
                };

                return (
                  <tr
                    key={row.santriId}
                    className="hover:bg-accent/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium dark:text-foreground-dark">
                      {row.namaSantri}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={row.status}
                        onChange={(e) =>
                          handleStatusChange(row.santriId, e.target.value as Status)
                        }
                        className={`bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none ${statusColors[row.status]}`}
                      >
                        <option value="hadir">Hadir</option>
                        <option value="sakit">Sakit</option>
                        <option value="izin">Izin</option>
                        <option value="terlambat">Terlambat</option>
                        <option value="absen">Absen</option>
                      </select>
                      <div className={`text-xs mt-1 ${statusColors[row.status]}`}>
                        {statusText[row.status]}
                      </div>
                    </td>

                    {/* Kolom Info Setoran */}
                    <td className="px-6 py-4">
                      {row.sudahSetor ? (
                        <div className="space-y-2">
                          {/* Centang untuk yang sudah setor */}
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <svg 
                                className="w-3 h-3 text-green-600 dark:text-green-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="3" 
                                  d="M5 13l4 4L19 7" 
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              Sudah Setor
                            </span>
                          </div>

                          {/* Info detail setoran - HANYA surat dan ayat */}
                          <div className="space-y-1 ml-7">
                            {row.setoranHariIni.map((setor, index) => (
                              <div key={setor.id} className="text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium dark:text-foreground-dark">
                                    {setor.surah}
                                  </span>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    Ayat {setor.ayat_mulai}-{setor.ayat_selesai}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : row.setoranTerakhir ? (
                        // Tampilkan setoran terakhir jika belum setor hari ini
                        <div className="space-y-1">
                          <div className="text-sm dark:text-foreground-dark">
                            <span className="text-muted-foreground">Terakhir: </span>
                            {row.setoranTerakhir.surah}
                            <span className="text-xs ml-2">
                              (Ayat {row.setoranTerakhir.ayat_mulai}-{row.setoranTerakhir.ayat_selesai})
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted italic text-xs">Belum ada setoran</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-auto sticky bottom-0 bg-card dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark backdrop-blur">
        <div className="flex items-center justify-between gap-6 px-6 py-5">
          {/* Container untuk dua baris summary */}
          <div className="flex-1">
            {/* Baris 1: Summary Kehadiran */}
            <div className="flex flex-wrap gap-4 mb-4">
              {[
                { label: "Total", value: summaryKehadiran.total, color: "text-foreground dark:text-foreground-dark" },
                { label: "Hadir", value: summaryKehadiran.hadir, color: "text-green-600 dark:text-green-400" },
                { label: "Sakit", value: summaryKehadiran.sakit, color: "text-yellow-600 dark:text-yellow-400" },
                { label: "Izin", value: summaryKehadiran.izin, color: "text-blue-600 dark:text-blue-400" },
                { label: "Terlambat", value: summaryKehadiran.terlambat, color: "text-orange-600 dark:text-orange-400" },
                { label: "Absen", value: summaryKehadiran.absen, color: "text-red-600 dark:text-red-400" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-background/40 dark:bg-background-dark/40 border border-border/40 rounded-2xl px-4 py-3 text-sm shadow-sm min-w-[80px]"
                >
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                  <p className={`font-bold text-lg ${item.color ?? ""}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Baris 2: Summary Setoran */}
            <div className="flex flex-wrap gap-4">
              {[
                { 
                  label: "Total Setoran", 
                  value: summarySetoran.totalSetoran, 
                  color: "text-emerald-600 dark:text-emerald-400" 
                },
                { 
                  label: "Sudah Setor", 
                  value: summarySetoran.santriSudahSetor, 
                  color: "text-emerald-600 dark:text-emerald-400" 
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-background/40 dark:bg-background-dark/40 border border-border/40 rounded-2xl px-4 py-3 text-sm shadow-sm min-w-[80px]"
                >
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                  <p className={`font-bold text-lg ${item.color ?? ""}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Simpan Absensi di sebelah kanan */}
          <div className="flex-shrink-0">
            <button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
            >
              Simpan Absensi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}