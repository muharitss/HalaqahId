import { Suspense } from "react";
import { AppSidebar, AppBreadcrumb } from "@/components/custom/layout";
import { MobileDock } from "@/components/custom/layout/MobileDock";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { SekolahSwitcher } from "@/components/ui/SekolahSwitcher";
import { NotificationBell } from "@/features/pengumuman/components/NotificationBell";
import { useAuth } from "@/features/auth/components/auth-provider";
import { Outlet, useNavigate } from "react-router-dom";
import { PageSkeleton } from "@/components/custom/loading/PageSkeleton";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/utils/use-mobile";
import { isKepalaRole, Role } from "@/types/domain/enums";
import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah/api/services/sekolahService";
import { useTenant } from "@/store/tenant-context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { user, isImpersonating } = useAuth();
  const { brand } = useTenant();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: sekolah } = useQuery({
    queryKey: ["profil-sekolah"],
    queryFn: async () => {
      const res = await sekolahService.getProfile();
      return res.data ?? null;
    },
    enabled: !!user?.id_sekolah,
  });

  const handleAvatarClick = () => {
    let targetPath = "/muhafidz/settings";
    if (user?.role === Role.SUPERADMIN) {
      targetPath = "/superadmin/settings";
    } else if (user && isKepalaRole(user.role)) {
      targetPath = "/kepala-muhafidz/settings";
    }
    navigate(targetPath);
  };

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}

      <SidebarInset
        className={cn(
          "flex-1 min-w-0 flex flex-col h-screen overflow-hidden", // Kunci: min-w-0 dan overflow-hidden
          isMobile ? "pb-20" : "",
        )}
      >
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6 sticky top-0 bg-background/95 backdrop-blur z-40 shadow-sm/5">
          <div className="flex items-center gap-3 md:gap-4">
            {isMobile && (
              <>
                {brand?.logo_url ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden bg-background border shadow-sm">
                    <img
                      src={brand.logo_url}
                      alt={brand.nama_aplikasi || "Logo"}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                    <FontAwesomeIcon icon={faBookOpen} className="text-base" />
                  </div>
                )}
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
              </>
            )}

            <h1 className="text-sm md:text-base lg:text-lg font-bold tracking-tight">
              {isMobile ? (brand?.nama_aplikasi || user?.name) : `Halo, ${user?.name}`}
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <NotificationBell />
            <SekolahSwitcher />
            <ThemeToggle />

            <button
              onClick={handleAvatarClick}
              className="focus:outline-none ml-1 relative group"
            >
              <div className="h-10 w-10 border-2 border-background ring-1 ring-border group-hover:ring-primary/50 rounded-full overflow-hidden bg-white flex items-center justify-center p-0 transition-all">
                {sekolah?.logo_url ? (
                  <img
                    src={sekolah.logo_url}
                    alt={sekolah.nama_sekolah}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-full h-full flex items-center justify-center text-xs font-bold rounded-full",
                      isImpersonating
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {sekolah?.nama_sekolah?.[0]?.toUpperCase() ||
                      user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              {isImpersonating && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-background"></span>
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full bg-slate-50/50 dark:bg-transparent flex flex-col justify-between">
          <div className="w-full p-4 md:p-6 box-border flex-1 space-y-4">
            <AppBreadcrumb />
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
          
          <footer className="py-4 px-4 md:px-6 text-center text-xs text-muted-foreground border-t bg-background/50">
            {brand?.copyright_text || `© ${new Date().getFullYear()} ${brand?.nama_aplikasi || "Halaqah.id"}. All rights reserved.`}
          </footer>
        </main>

        {isMobile && <MobileDock />}
      </SidebarInset>
    </SidebarProvider>
  );
}
