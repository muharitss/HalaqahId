export default function MuhafidzPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold dark:text-white">Absensi Hari Ini</h2>
        <p className="text-text-secondary">Silakan isi kehadiran santri untuk tanggal {new Date().toLocaleDateString('id-ID')}</p>
      </header>
      
      <div className="grid gap-6">
        {/* Nanti di sini kita masukkan komponen Tabel Absensi */}
        <div className="h-64 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
          <p className="text-muted-foreground">Tabel Absensi Santri Akan Muncul di Sini</p>
        </div>
      </div>
    </div>
  );
}