import { ShieldAlert, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button"; // Sesuaikan dengan UI kit kamu

export function NoHalaqahView() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 rounded-full bg-yellow-100 p-6 text-yellow-600">
        <ShieldAlert size={48} />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        Akses Terbatas
      </h1>
      <p className="mb-8 max-w-md text-slate-600">
        Mohon maaf, akun Anda saat ini <strong>tidak terdaftar</strong> dalam halaqah manapun. 
        Silakan hubungi <strong>Kepala Muhafiz</strong> untuk penempatan tugas atau aktivasi halaqah Anda.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Status
        </Button>
        <Button variant="destructive" onClick={handleLogout} className="gap-2">
          <LogOut size={16} /> Keluar
        </Button>
      </div>
    </div>
  );
}