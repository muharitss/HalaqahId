export default function MuhafidzPage() {
  return (
    <div className="space-y-6">
      <header className="text-left">
        <h2 className="text-2xl font-bold dark:text-white">Absensi Hari Ini</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
          Silakan tandai kehadiran santri untuk hari ini.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm min-h-[400px]">
        {/* Konten tabel absensi akan kita buat di sini */}
        <div className="flex flex-col items-center justify-center h-full py-20 text-center">
           <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary text-2xl">📝</span>
           </div>
           <p className="text-text-secondary dark:text-text-secondary-dark font-medium">
             Siap memproses data absensi...
           </p>
        </div>
      </div>
    </div>
  );
}