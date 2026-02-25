import { useNavigate } from "react-router-dom";
import { Info, Trash2, ChevronLeft, LogOut, ArrowLeft, Bot } from "lucide-react"; // Tambahkan icon
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingItem } from "./SettingItem";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Settings } from "@/components/typed-text";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, isImpersonating, stopImpersonating } = useAuth();
  const isSuper = user?.role === "superadmin";

  const basePath = isSuper ? "/kepala-muhafidz/settings" : "/muhafidz/settings";

  const handleBackToSuperadmin = async () => {
    if (stopImpersonating) {
      await stopImpersonating();
      navigate("/kepala-muhafidz");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <Settings/>
          <p className="text-sm text-muted-foreground">Detail akun dan konfigurasi sistem</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* GRUP 1: PROFIL & AI */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-muted-foreground ml-1">Fitur Tambahan</h3>
          <Card>
            <SettingItem 
              icon={<Bot size={18} className="text-blue-500" />}
              title="Tahfidz AI"
              description="Asisten virtual hafalan santri"
              onClick={() => navigate(isSuper ? "/kepala-muhafidz/tahfidzai" : "/muhafidz/tahfidzai")}
            />
          </Card>
        </section>

        {/* GRUP 2: SISTEM & INFO */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-muted-foreground ml-1">Informasi</h3>
          <Card className="overflow-hidden border-primary/5 shadow-sm">
            <SettingItem 
              icon={<Info size={18} />}
              title="Informasi & SOP"
              description="Pedoman penggunaan dan peraturan"
              onClick={() => navigate(`${basePath}/info`)}
            />
            {isSuper && (
              <>
                <SettingItem 
                  icon={<Trash2 size={18} className="text-destructive" />}
                  title="Tempat Sampah"
                  description="Pulihkan data muhafiz atau halaqah"
                  onClick={() => navigate(`${basePath}/trash`)}
                />
              </>
            )}
          </Card>
        </section>

        {/* GRUP 3: TINDAKAN KHUSUS (Impersonate & Logout) */}
        <section className="space-y-3">
           <h3 className="text-xs font-bold uppercase text-muted-foreground ml-1">Sesi</h3>
           <Card className="overflow-hidden border-primary/5 shadow-sm">
              {isImpersonating && (
                <>
                  <SettingItem 
                    icon={<ArrowLeft size={18} className="text-yellow-600" />}
                    title="Kembali ke Superadmin"
                    description="Keluar dari mode impersonasi"
                    onClick={handleBackToSuperadmin}
                  />
                  <Separator />
                </>
              )}
              <SettingItem 
                icon={<LogOut size={18} className="text-destructive" />}
                title="Keluar Aplikasi"
                description="Akhiri sesi Anda sekarang"
                onClick={logout}
              />
           </Card>
        </section>
      </div>
    </div>
  );
}