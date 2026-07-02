/**
 * @deprecated
 * File ini sudah tidak digunakan setelah migrasi ke createBrowserRouter.
 * Semua route muhafidz (termasuk logika NoHalaqahView guard) sekarang terdefinisi
 * secara flat di src/routes/index.tsx via komponen MuhafizGuard.
 * File ini dipertahankan agar tidak ada import error pada file lain yang mungkin masih merujuknya.
 */
export default function MuhafidzRoot() {
  return null;
}
