import { AppSidebar } from "@/components/shared/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom"; 
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout() {
  const { user, isImpersonating } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-display">
        <AppSidebar />
        
        <SidebarInset className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 lg:px-6 sticky top-0 bg-background/95 backdrop-blur z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div className="flex flex-col text-left">
                <h1 className="text-lg font-semibold leading-tight">Halo, {user?.username}</h1>
                {/* <p className="text-xs text-muted-foreground">{user?.username}</p> */}
              </div>
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

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
              <Outlet /> 
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}