import { useNavigate } from "react-router-dom";
import { Info, Trash2, ChevronLeft, LogOut, ArrowLeft, Bot, Link as LinkIcon, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingItem } from "./SettingItem";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Settings } from "@/components/typed-text";
import { Separator } from "@/components/ui/separator";
import { isKepalaRole } from "@/types/domain/enums";
import { sekolahService } from "@/features/superadmin/sekolah/services/sekolahService";
import { toast } from "sonner";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, isImpersonating, stopImpersonating } = useAuth();
  const isKepala = user ? isKepalaRole(user.role) : false;

  const basePath = isKepala ? "/kepala-muhafidz/settings" : "/muhafidz/settings";

  const handleBackToSuperadmin = async () => {
    if (stopImpersonating) {
      await stopImpersonating();
      navigate("/kepala-muhafidz");
    }
  };

  const handleCopyDisplayLink = async () => {
    try {
      const profile = await sekolahService.getProfile();
      const displayToken = profile.data?.display_token;
      
      if (!displayToken) {
        toast.error("Gagal mendapatkan display token.");
        return;
      }

      const publicLink = `${window.location.origin}/display/${displayToken}`;
      await navigator.clipboard.writeText(publicLink);
      toast.success("Link portal publik berhasil disalin ke clipboard!");
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat menyalin link.", error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-6 border-b pb-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full h-10 w-10 shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <Settings/>
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
              onClick={() => navigate(isKepala ? "/kepala-muhafidz/tahfidzai" : "/muhafidz/tahfidzai")}
            />
            {isKepala && (
              <SettingItem 
                icon={<Building2 size={18} className="text-primary" />}
                title="Profil Sekolah"
                description="Kelola informasi dan alamat sekolah Anda"
                onClick={() => navigate("/kepala-muhafidz/profil-sekolah")}
              />
            )}
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
            {isKepala && (
              <>
                <SettingItem 
                  icon={<LinkIcon size={18} className="text-emerald-500" />}
                  title="Salin Link Portal Publik"
                  description="Bagikan akses ke wali santri"
                  onClick={handleCopyDisplayLink}
                />
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