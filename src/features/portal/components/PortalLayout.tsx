import React from "react";
import { LogOut, GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePortalContext } from "../store/portal-context";
import { useNavigate } from "react-router-dom";

interface PortalLayoutProps {
  children: React.ReactNode;
  schoolSlug?: string;
  santriName?: string;
  nis?: string;
}

export function PortalLayout({
  children,
  schoolSlug,
  santriName,
  nis,
}: PortalLayoutProps) {
  const { session, logout } = usePortalContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const slug = schoolSlug || session?.sekolah.slug || "demo";
    await logout();
    navigate(`/${slug}/portal`, { replace: true });
  };

  const displayName = santriName || session?.santri.nama_santri;
  const displayNis = nis || session?.santri.nomor_induk_santri;
  const displaySekolah = session?.sekolah.nama_sekolah || "Pesantren / TPQ";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <School className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base truncate">
                  {displaySekolah}
                </span>
                <Badge variant="secondary" className="text-[10px] uppercase font-semibold tracking-wider">
                  Portal Wali
                </Badge>
              </div>
              {displayName && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium text-foreground truncate">{displayName}</span>
                  {displayNis && <span>• NIS: {displayNis}</span>}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 gap-1.5"
            title="Keluar dari Portal"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-4 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>Portal Monitoring Hafalan Santri &mdash; Ditenagai oleh Halaqah.id</p>
        </div>
      </footer>
    </div>
  );
}
