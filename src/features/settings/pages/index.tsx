import { useState } from "react";
import { toast } from "sonner";
import { Role } from "@/types/domain/enums";
import { Separator } from "@/components/ui/separator";

import { useSettingsPage } from "../hooks/useSettingsPage";
import {
  SettingsHeader,
  AkunSection,
  KurikulumSection,
  InformasiSection,
  SesiSection,
  SettingsEmptyState,
  LogoutDialog,
} from "../components";

const SETTINGS_SEARCH_KEYWORDS = [
  "profil",
  "saya",
  "akun",
  "pribadi",
  "tahfidz",
  "ai",
  "bot",
  "virtual",
  "sekolah",
  "lembaga",
  "terminologi",
  "glosarium",
  "istilah",
  "santri",
  "halaqah",
  "muhafiz",
  "kategori",
  "setoran",
  "form",
  "kolom",
  "target",
  "hafalan",
  "ujian",
  "pengaturan",
  "kelulusan",
  "rumus",
  "info",
  "sop",
  "pedoman",
  "peraturan",
  "salin",
  "link",
  "portal",
  "publik",
  "wali",
  "tempat",
  "sampah",
  "trash",
  "recycle",
  "admin",
  "kembali",
  "impersonasi",
  "keluar",
  "logout",
  "aplikasi",
  "sesi",
];

export default function SettingsPage() {
  const {
    navigate,
    user,
    isLoading,
    logout,
    isImpersonating,
    isKepala,
    basePath,
    dashboardPath,
    handleBackToSuperadmin,
    handleCopyDisplayLink,
  } = useSettingsPage();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  if (isLoading && !user) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-14 bg-muted rounded-xl" />
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const handleAuditLogClick = () => {
    if (
      user?.role === Role.SUPERADMIN ||
      user?.originalUser?.role === Role.SUPERADMIN
    ) {
      navigate("/superadmin/audit-logs");
    } else {
      toast.info("Fitur Audit Log hanya dapat diakses oleh Administrator.");
    }
  };

  const q = searchQuery.toLowerCase().trim();
  const hasMatch =
    !q ||
    SETTINGS_SEARCH_KEYWORDS.some((kw) => kw.includes(q) || q.includes(kw)) ||
    (user?.name?.toLowerCase().includes(q) ?? false);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header dengan Breadcrumb, Judul, Search, & Audit Log */}
      <SettingsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        onNavigateHome={() => navigate(dashboardPath)}
        onAuditLogClick={handleAuditLogClick}
      />

      <Separator />

      {/* Tampilan Kosong jika pencarian tidak ditemukan */}
      {!hasMatch && searchQuery.trim() !== "" ? (
        <SettingsEmptyState onReset={() => setSearchQuery("")} />
      ) : (
        /* Seksi-seksi Pengaturan Modular */
        <div className="space-y-4">
          <AkunSection
            user={user}
            isKepala={isKepala}
            searchQuery={searchQuery}
            onNavigate={navigate}
          />

          <KurikulumSection
            isKepala={isKepala}
            searchQuery={searchQuery}
            onNavigate={navigate}
          />

          <InformasiSection
            isKepala={isKepala}
            basePath={basePath}
            searchQuery={searchQuery}
            onNavigate={navigate}
            onCopyLink={handleCopyDisplayLink}
          />

          <SesiSection
            isImpersonating={isImpersonating}
            searchQuery={searchQuery}
            onBackToSuperadmin={handleBackToSuperadmin}
            onLogoutClick={() => setIsLogoutOpen(true)}
          />
        </div>
      )}

      {/* Modal Dialog Konfirmasi Logout */}
      <LogoutDialog
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        onConfirm={() => {
          setIsLogoutOpen(false);
          logout();
        }}
      />
    </div>
  );
}
