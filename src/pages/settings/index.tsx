import { useNavigate } from "react-router-dom";
import { User, Info, Trash2, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingItem } from "./SettingItem";
import { useAuth } from "@/context/AuthContext";
import { Settings } from "@/components/ui/TypedText";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuper = user?.role === "superadmin";

  const basePath = isSuper ? "/kepala-muhafidz/settings" : "/settings";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <Settings/>
          <p className="text-sm md:text-base text-muted-foreground">Kelola akun dan sistem halaqah Anda</p>
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <Card className="overflow-hidden">
            <SettingItem 
              icon={<User size={20} />}
              title="Profil Saya"
              description="Kelola nama, email, dan keamanan akun"
              onClick={() => navigate(`${basePath}/account`)}
            />
          </Card>
        </section>

        <section>
          <Card className="overflow-hidden">
            <SettingItem 
              icon={<Info size={20} />}
              title="Informasi & SOP"
              description="SOP, Jobdesk, dan Reward Setoran"
              onClick={() => navigate(`${basePath}/info`)}
            />
          </Card>
        </section>

        {isSuper && (
          <section>
            <Card className="overflow-hidden">
              <SettingItem 
                icon={<Trash2 size={20} />}
                title="Tempat Sampah"
                description="Pulihkan muhafiz atau halaqah yang dihapus"
                onClick={() => navigate(`${basePath}/trash`)}
              />
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}