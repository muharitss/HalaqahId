import { useState } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-background dark:bg-background-dark font-display relative">
      
      {/* Sidebar - Desktop & Mobile */}
      {/* Overlay untuk mobile saat sidebar terbuka */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition duration-300 ease-in-out lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="
            fixed top-0 left-0 right-0 z-40
            lg:static
            flex h-16 items-center justify-between
            border-b border-border
            bg-surface-light px-4 lg:px-8
            dark:bg-surface-dark
          "> 

          <div className="flex items-center gap-4">
            {/* Hamburger Button - Hanya muncul di mobile */}
            <button 
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden dark:text-white"
            >
              <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
            </button>

            <div className="flex flex-col text-left">
              <h1 className="text-sm font-semibold dark:text-white leading-tight">Selamat Datang,</h1>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">{user?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle variant="simple" />
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-xs uppercase">
              {user?.username?.substring(0, 2)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-4 text-left">
          <div className="mx-auto max-w-7xl">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
}