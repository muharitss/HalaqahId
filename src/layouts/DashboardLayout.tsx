import { AppSidebar } from "@/components/shared/Sidebar";
import { MobileDock } from "@/components/shared/MobileDock";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom"; 
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

export default function DashboardLayout() {
  const { user, isImpersonating } = useAuth();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
        {!isMobile && <AppSidebar />}
        
        <SidebarInset className={isMobile ? "pb-20" : ""}>
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 lg:px-6 sticky top-0 bg-background/95 backdrop-blur z-40">
            <div className="flex items-center gap-4">
              {!isMobile && <SidebarTrigger />}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
              </div>
              <div className="flex flex-col overflow-hidden whitespace-nowrap group-data-[collapsible=icon]:hidden">
                <span className="font-bold tracking-tight">Halo, {user?.username}</span>
                {isImpersonating && <span className="text-[10px] text-yellow-500 font-semibold uppercase">Muhafidz Mode</span>}
              </div>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className={isImpersonating ? "bg-yellow-500/10 text-yellow-600" : "bg-primary/10 text-primary"}>
                  {user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
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