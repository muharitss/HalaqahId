import { ArrowLeft, LogOut, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SettingItem } from "./SettingItem";

interface SesiSectionProps {
  isImpersonating: boolean;
  searchQuery: string;
  onBackToSuperadmin: () => void;
  onLogoutClick: () => void;
}

export function SesiSection({
  isImpersonating,
  searchQuery,
  onBackToSuperadmin,
  onLogoutClick,
}: SesiSectionProps) {
  const q = searchQuery.toLowerCase().trim();

  const items = [
    {
      id: "back-admin",
      icon: <ArrowLeft className="h-4 w-4" />,
      title: "Kembali ke Admin",
      description: "Keluar dari mode impersonasi",
      keywords:
        "kembali ke admin impersonasi sesi switch user keluar mode penyamaran",
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={onBackToSuperadmin}
          className="cursor-pointer"
        >
          <Undo2 className="h-4 w-4 mr-1.5" />
          Kembali
        </Button>
      ),
      visible: isImpersonating,
    },
    {
      id: "logout",
      icon: <LogOut className="h-4 w-4 text-destructive" />,
      title: "Keluar Aplikasi",
      description: "Akhiri sesi Anda sekarang",
      keywords:
        "keluar aplikasi logout log-out keluar sistem akhiri sesi sign out",
      destructive: true,
      action: (
        <Button
          size="sm"
          variant="destructive"
          onClick={onLogoutClick}
          className="cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          Keluar
        </Button>
      ),
      visible: true,
    },
  ].filter((item) => {
    if (!item.visible) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    );
  });

  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
        4. Sesi & Akses Kendali
      </h3>
      <Card className="p-0">
        <CardContent className="p-0 divide-y">
          {items.map((item) => (
            <SettingItem key={item.id} {...item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
