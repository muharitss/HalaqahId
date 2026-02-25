import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileDock } from "@/components/layout/MobileDock";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom"; 
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBookOpen } from "@fortawesome/free-solid-svg-icons";

export default function DashboardLayout() {
  const { user, isImpersonating } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    const targetPath = user?.role === "superadmin" ? "/kepala-muhafidz/settings" : "muhafidz/settings";
    navigate(targetPath);
  };

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}
      
      <SidebarInset className={isMobile ? "pb-20" : ""}>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 lg:px-6 sticky top-0 bg-background/95 backdrop-blur z-40">
          <div className="flex items-center gap-3 md:gap-4">
            {!isMobile && <SidebarTrigger />}
            
            {isMobile && (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                <FontAwesomeIcon icon={faBookOpen} className="text-base" />
              </div>
            )}

            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            
            <h1 className="text-sm md:text-lg font-semibold leading-tight">
              {isMobile ? user?.username : `Halo, ${user?.username}`}
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <ThemeToggle />

            <button 
              onClick={handleAvatarClick}
              className="focus:outline-none ml-1 relative group"
            >
              <Avatar className="h-8 w-8 border group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className={isImpersonating ? "bg-yellow-500/10 text-yellow-600" : "bg-primary/10 text-primary"}>
                  {user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isImpersonating && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
            <Outlet /> 
          </div>
        </main>

        {isMobile && <MobileDock />}
      </SidebarInset>
    </SidebarProvider>
  );
}