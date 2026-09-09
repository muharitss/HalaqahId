import { Home, ChevronRight, Search, X, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettingsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onNavigateHome: () => void;
  onAuditLogClick: () => void;
  version?: string;
}

export function SettingsHeader({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onNavigateHome,
  onAuditLogClick,
}: SettingsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb sederhana */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Beranda</span>
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Pengaturan</span>
      </nav>

      {/* Title, Search, Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pengaturan
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola konfigurasi sistem, akun pengguna, preferensi aplikasi, dan integrasi ma'had Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari pengaturan..."
              className="pl-8"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClearSearch}
                className="absolute right-1 top-1 h-7 w-7 text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <Button variant="outline" onClick={onAuditLogClick}>
            <History className="h-4 w-4 mr-2 text-muted-foreground" />
            Audit Log
          </Button>
        </div>
      </div>
    </div>
  );
}
