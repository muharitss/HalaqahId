import { useState } from "react";
type Status = "hadir" | "absen" | "izin";

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
  keterangan?: string;
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
    { santriId: 2, status: "izin", keterangan: "Sakit" },
  ]);

  const handleStatusChange = (santriId: number, status: Status) => {
    setAbsensi((prev) => {
      const exists = prev.find((a) => a.santriId === santriId);

      if (exists) {
        return prev.map((a) =>
          a.santriId === santriId
            ? {
                ...a,
                status,
                keterangan: status === "izin" ? a.keterangan : undefined,
              }
            : a
        );
      }

      return [...prev, { santriId, status }];
    });
  };

  const handleKeteranganChange = (santriId: number, value: string) => {
    setAbsensi((prev) =>
      prev.map((a) =>
        a.santriId === santriId
          ? { ...a, keterangan: value }
          : a
      )
    );
  };

  const handleSubmit = () => {
    const invalid = absensi.find(
      (a) => a.status === "izin" && (!a.keterangan || a.keterangan.trim() === "")
    );

    if (invalid) {
      alert("Gagal menyimpan!\nIzin wajib diisi keterangan.");
      return;
    }

    console.log("Payload ke backend:", {
      tanggal: new Date(),
      absensi,
    });

    alert("Absensi berhasil disimpan");
  };

  const rows = santri.map((s) => {
    const data = absensi.find((a) => a.santriId === s.id);

    return {
      santriId: s.id,
      namaSantri: s.nama,
      status: data?.status ?? "absen",
      keterangan: data?.keterangan,
    };
  });

  const summary = {
    total: rows.length,
    hadir: rows.filter((r) => r.status === "hadir").length,
    izin: rows.filter((r) => r.status === "izin").length,
    absen: rows.filter((r) => r.status === "absen").length,
  };

  const hasInvalidIzin = rows.some(
    (row) =>
      row.status === "izin" &&
      (!row.keterangan || row.keterangan.trim() === "")
  );

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
                <th className="px-6 py-4 font-semibold">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border-dark">
              {rows.map((row) => (
                <tr
                  key={row.santriId}
                  className={`
                    transition-colors
                    ${
                      row.status === "izin" &&
                      (!row.keterangan || row.keterangan.trim() === "")
                        ? "bg-destructive/10"
                        : "hover:bg-accent/5"
                    }
                  `}
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
                      className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark border border-border dark:border-border-dark rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="absen">Absen</option>
                      <option value="izin">Izin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    {row.status === "izin" ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={row.keterangan || ""}
                          onChange={(e) =>
                            handleKeteranganChange(row.santriId, e.target.value)
                          }
                          placeholder="Alasan izin..."
                          className="w-full max-w-xs rounded-md border px-3 py-1.5 outline-none
                            border-border focus:ring-2 focus:ring-primary"
                        />

                        {(!row.keterangan || row.keterangan.trim() === "") && (
                          <p className="text-xs text-destructive">
                            Keterangan wajib diisi
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted italic text-xs">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-auto sticky bottom-0 bg-card dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark backdrop-blur">
        <div className="flex items-center justify-between gap-6 px-6 py-5">

          {/* Summary */}
          <div className="flex gap-4">
            {[
              { label: "Total", value: summary.total, color: "text-foreground dark:text-foreground-dark"},
              { label: "Hadir", value: summary.hadir, color: "text-primary" },
              { label: "Izin", value: summary.izin, color: "text-yellow-500" },
              { label: "Absen", value: summary.absen, color: "text-red-500" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-background/40 dark:bg-background-dark/40 border border-border/40 rounded-2xl px-4 py-3 text-sm shadow-sm"
              >
                <p className="text-muted-foreground">{item.label}</p>
                <p className={`font-bold text-lg ${item.color ?? ""}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Action */}
          <button
            onClick={handleSubmit}
            disabled={hasInvalidIzin}
            className={`bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-
              ${hasInvalidIzin ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary hover:bg-primary-dark text-white active:scale-95"}`}
          >
            Simpan Absensi
          </button>
        </div>
      </div>
    </div>
  );
}