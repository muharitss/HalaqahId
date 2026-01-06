import React, { useEffect, useState } from "react";

// ===== Types =====
type Status = "hadir" | "absen" | "izin";

interface AbsensiRow {
  santriId: number;
  namaSantri: string;
  status: Status;
  keterangan?: string;
}

// ===== Page =====
export default function AbsensiPage() {
  const [rows, setRows] = useState<AbsensiRow[]>([
    // CONTOH SEMENTARA
    { santriId: 1, namaSantri: "Ahmad", status: "hadir" },
    { santriId: 2, namaSantri: "Fahri", status: "absen" },
    { santriId: 3, namaSantri: "Zaid", status: "izin", keterangan: "Sakit" },
  ]);

  const [isDark, setIsDark] = useState(false);

  // ===== Init theme dari localStorage =====
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // ===== Toggle dark mode =====
  const handleStatusChange = (index: number, status: Status) => {
    const updated = [...rows];
    updated[index].status = status;
    if (status !== "izin") {
      updated[index].keterangan = undefined;
    }
    setRows(updated);
  };

  const handleKeteranganChange = (index: number, value: string) => {
    const updated = [...rows];
    updated[index].keterangan = value;
    setRows(updated);
  };

  const handleSubmit = () => {
    // validasi: izin wajib keterangan
    const invalidIzin = rows.find(
      (row) => row.status === "izin" && (!row.keterangan || row.keterangan.trim() === "")
    );

    if (invalidIzin) {
      alert("Gagal menyimpan data!\nSantri dengan status IZIN wajib mengisi keterangan.");
      return;
    }

    const payload = rows.map((row) => ({
      santri_id: row.santriId,
      tanggal: new Date(),
      status: row.status,
      keterangan: row.status === "izin" ? row.keterangan : null,
    }));

    console.log("Payload absensi:", payload);
    alert("Absensi hari ini berhasil disimpan");
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--card-foreground)]">
            Absensi Hari Ini
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Silakan isi kehadiran santri untuk tanggal{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* ===== Table ===== */}
      <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-accent)]">
            <tr>
              <th className="px-4 py-3 text-left">Santri</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.santriId} className="border-t border-[var(--color-border)]">
                <td className="px-4 py-3 font-medium text-[var(--card-foreground)]">{row.namaSantri}</td>
                <td className="px-4 py-3 font-medium text-[var(--card-foreground)]">
                  <select
                    value={row.status}
                    onChange={(e) =>
                      handleStatusChange(index, e.target.value as Status)
                    }
                      className="bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-sm)] px-2 py-1"
                  >
                    <option value="hadir">Hadir</option>
                    <option value="absen">Absen</option>
                    <option value="izin">Izin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {row.status === "izin" ? (
                    <input
                      type="text"
                      value={row.keterangan || ""}
                      onChange={(e) =>
                        handleKeteranganChange(index, e.target.value)
                      }
                      placeholder="Alasan izin"
                      className=" w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted)] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    />
                  ) : (
                    <span className="text-[var(--muted)] italic">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Submit ===== */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-6 py-2 rounded-[var(--radius-md)] font-medium hover:bg-[var(--color-primary-dark)]"
        >
          Simpan Absensi
        </button>
      </div>
    </div>
  );
}
