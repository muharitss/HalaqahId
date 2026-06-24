import { AppSidebar } from "@/components/custom/layout/AppSidebar";
import { MobileDock } from "@/components/custom/layout/MobileDock";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { useAuth } from "@/features/auth/components/auth-provider";
import { Outlet, useNavigate } from "react-router-dom"; 
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/utils/use-mobile";
import { isKepalaRole, Role } from "@/types/domain/enums";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { user, isImpersonating } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate(); 

  const handleAvatarClick = () => {
    const targetPath = user?.role === Role.SUPERADMIN ? "/superadmin/settings" : user && isKepalaRole(user.role) ? "/kepala-muhafidz/settings" : "muhafidz/settings";
    navigate(targetPath);
  };

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}
      
      <SidebarInset className={cn(
        "flex-1 min-w-0 flex flex-col h-screen overflow-hidden", // Kunci: min-w-0 dan overflow-hidden
        isMobile ? "pb-20" : ""
      )}>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6 lg:px-8 sticky top-0 bg-background/95 backdrop-blur z-40 shadow-sm/5">
          <div className="flex items-center gap-3 md:gap-4">
            {!isMobile && <SidebarTrigger />}
            
            {isMobile && (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                <FontAwesomeIcon icon={faBookOpen} className="text-base" />
              </div>
            )}

            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            
            <h1 className="text-sm md:text-base lg:text-lg font-bold tracking-tight">
              {isMobile ? user?.name : `Halo, ${user?.name}`}
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <ThemeToggle />

            <button 
              onClick={handleAvatarClick}
              className="focus:outline-none ml-1 relative group"
            >
              <Avatar className="h-9 w-9 border-2 border-background ring-1 ring-border group-hover:ring-primary/50 transition-all">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className={isImpersonating ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"}>
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isImpersonating && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-background"></span>
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full bg-slate-50/50">
          <div className="container mx-auto p-4 md:p-6 lg:p-10 max-w-7xl w-full box-border">
            <Outlet /> 
          </div>
        </main>

        {isMobile && <MobileDock />}
      </SidebarInset>
    </SidebarProvider>
  );
}
