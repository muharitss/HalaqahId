import { useState, useEffect } from 'react';
import { akunService } from '@/services/akunService'; // Sesuaikan path

export default function KepalaMuhafidzDashboard() {
  const [muhafizData, setMuhafizData] = useState<any[]>([]);
  const [totalMuhafiz, setTotalMuhafiz] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data dari API
  useEffect(() => {
    const fetchMuhafizData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await akunService.getAllMuhafiz();
        
        if (response.success && response.data) {
          setMuhafizData(response.data);
          setTotalMuhafiz(response.data.length);
        } else {
          setError(response.message || 'Gagal mengambil data muhafiz');
        }
      } catch (err: any) {
        console.error('Error fetching muhafiz data:', err);
        setError(err.message || 'Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchMuhafizData();
  }, []);

  // Menghitung statistik sederhana
  const totalHalaqah = muhafizData.length * 2; // Contoh: asumsi setiap muhafiz menangani 2 halaqah
  const kehadiranHariIni = muhafizData.length > 0 ? '85%' : '0%'; // Data dummy, bisa diganti dengan API jika ada

  return (
    <div className="space-y-6">
      <header className="text-left">
        <h2 className="text-2xl font-bold dark:text-white">Dashboard Kepala Muhafidz</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
          Selamat datang di dashboard manajemen halaqah
        </p>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <span className="ml-3 dark:text-white">Memuat data...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="text-center py-6">
            <div className="text-red-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold dark:text-white mb-2">Gagal Memuat Data</h3>
            <p className="text-text-secondary dark:text-text-secondary-dark">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Widget/Statistik - Tampilkan hanya jika tidak loading dan tidak error */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Total Muhafiz</h3>
              <p className="text-3xl font-bold text-primary">{totalMuhafiz}</p>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-2">
                Total musyrif yang terdaftar
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Total Halaqah</h3>
              <p className="text-3xl font-bold text-primary">{totalHalaqah}</p>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-2">
                Estimasi jumlah halaqah aktif
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Kehadiran Hari Ini</h3>
              <p className="text-3xl font-bold text-primary">{kehadiranHariIni}</p>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-2">
                Rata-rata kehadiran musyrif
              </p>
            </div>
          </div>

          {/* Tabel Daftar Muhafiz */}
          <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg dark:text-white">Daftar Muhafiz</h3>
              <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                Total: {totalMuhafiz} orang
              </span>
            </div>

            {muhafizData.length === 0 ? (
              <div className="text-center py-10">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 dark:text-white">Belum ada data muhafiz</p>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  Data akan muncul setelah muhafiz terdaftar
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border dark:border-border-dark">
                      <th className="text-left py-3 px-4 dark:text-white font-medium">No</th>
                      <th className="text-left py-3 px-4 dark:text-white font-medium">Nama</th>
                      <th className="text-left py-3 px-4 dark:text-white font-medium">Email</th>
                      <th className="text-left py-3 px-4 dark:text-white font-medium">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {muhafizData.map((muhafiz, index) => (
                      <tr key={muhafiz.id_user} className="border-b border-border dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-3 px-4 dark:text-white">{index + 1}</td>
                        <td className="py-3 px-4 dark:text-white">
                          {muhafiz.username || 'Tidak ada nama'}
                        </td>
                        <td className="py-3 px-4 dark:text-white">{muhafiz.email}</td>
                        <td className="py-3 px-4 dark:text-white">{muhafiz.id_user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}