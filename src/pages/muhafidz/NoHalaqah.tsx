import { Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NoHalaqahView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <Home className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Belum Memiliki Halaqah</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, akun Anda belum terdaftar dalam halaqah manapun. Silakan hubungi Kepala Muhafidz untuk pendaftaran halaqah.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/muhafidz/settings")} variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Pengaturan
        </Button>
      </div>
    </div>
  );
}
