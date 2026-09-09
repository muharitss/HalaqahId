import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SettingItem } from "./SettingItem";
import { useTerminology } from "@/hooks/useTerminology";
import type { AuthUser } from "@/types/domain/auth";

interface AkunSectionProps {
  user: AuthUser | null;
  isKepala: boolean;
  searchQuery: string;
  onNavigate: (path: string) => void;
}

function getInitials(name?: string) {
  if (!name) return "US";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AkunSection({
  user,
  isKepala,
  searchQuery,
  onNavigate,
}: AkunSectionProps) {
  const labelSekolah = useTerminology("SEKOLAH");
  const q = searchQuery.toLowerCase().trim();

  const items = [
    {
      id: "profil-saya",
      icon: (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs font-bold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
      ),
      title: "Profil Saya",
      description: "Lihat dan perbarui informasi pribadi Anda",
      actionLabel: "Kelola Akun",
      onClick: () =>
        onNavigate(
          isKepala ? "/kepala-muhafidz/profil" : "/muhafidz/profil"
        ),
      keywords: `profil saya akun user nama email ${user?.name?.toLowerCase() ?? ""}`,
      visible: true,
    },
    {
      id: "profil-sekolah",
      icon: <Building2 className="h-4 w-4" />,
      title: `Profil ${labelSekolah}`,
      description: `Kelola informasi dan alamat ${labelSekolah.toLowerCase()} Anda`,
      onClick: () => onNavigate("/kepala-muhafidz/profil-sekolah"),
      keywords: `profil sekolah lembaga npsn yayasan alamat kontak logo kop surat mudir ${labelSekolah.toLowerCase()}`,
      visible: isKepala,
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
        1. Akun & Profil
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
