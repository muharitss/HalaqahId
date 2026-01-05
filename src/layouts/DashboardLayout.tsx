import { Sidebar } from "@/components/shared/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom"; 

// Hapus interface DashboardLayoutProps { children: React.ReactNode }

export default function DashboardLayout() { // Hapus { children } dari sini
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-background dark:bg-background-dark font-display">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface-light px-8 dark:bg-surface-dark transition-colors">
          <div className="flex flex-col text-left">
            <h1 className="text-sm font-semibold dark:text-white">Selamat Datang,</h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">{user?.nama}</p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle variant="simple" />
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-xs uppercase">
              {user?.nama?.substring(0, 2)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 text-left">
          <div className="mx-auto max-w-7xl">
            {/* Outlet ini akan otomatis merender component yang ada di dalam Route di index.tsx */}
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
}