export default function KepalaMuhafidzDashboard() {
  return (
    <div className="space-y-6">
      <header className="text-left">
        <h2 className="text-2xl font-bold dark:text-white">Dashboard Kepala Muhafidz</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
          Selamat datang di dashboard manajemen halaqah
        </p>
      </header>

      {/* Widget/Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <h3 className="font-semibold text-lg mb-2 dark:text-white">Total Musyrif</h3>
          <p className="text-3xl font-bold text-primary">12</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <h3 className="font-semibold text-lg mb-2 dark:text-white">Total Halaqah</h3>
          <p className="text-3xl font-bold text-primary">8</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <h3 className="font-semibold text-lg mb-2 dark:text-white">Kehadiran Hari Ini</h3>
          <p className="text-3xl font-bold text-primary">85%</p>
        </div>
      </div>

      {/* Tabel atau konten lainnya */}
      <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm min-h-[400px]">
        <h3 className="font-semibold text-lg mb-4 dark:text-white">Aktivitas Terbaru</h3>
        {/* Konten tabel atau grafik */}
      </div>
    </div>
  );
}