import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartPie, 
  faUsers, 
  faBook, 
  faClipboardCheck, 
  faUserTie,
  faSignOutAlt,
  faBookOpen,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Definisi Menu berdasarkan Role (Sesuai Flowchart)
  const menuItems = user?.role === "kepala_muhafidz" 
    ? [
        { name: "Dashboard", path: "/kepala-muhafidz", icon: faChartPie },
        { name: "Kelola Musyrif", path: "/kepala-muhafidz/musyrif", icon: faUserTie },
        { name: "Kelola Halaqah", path: "/kepala-muhafidz/halaqah", icon: faBook },
        { name: "Lihat Laporan", path: "/kepala-muhafidz/laporan", icon: faClipboardCheck },
      ]
    : [
        { name: "Absensi Hari Ini", path: "/muhafidz", icon: faClipboardCheck },
        { name: "Input Setoran", path: "/muhafidz/setoran", icon: faBookOpen },
        { name: "Kelola Santri", path: "/muhafidz/santri", icon: faUsers },
        { name: "Progres Santri", path: "/muhafidz/progres", icon: faChartPie },
      ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface-light dark:bg-surface-dark transition-colors duration-300">
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-between px-6"> 
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <span className="text-xl font-bold tracking-tight dark:text-white font-display">HalaqahId</span>
        </div>
        
        {/* Tombol Close - Hanya muncul di mobile */}
        <button onClick={onClose} className="lg:hidden text-text-secondary dark:text-white">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose} // Tutup sidebar setelah klik link di mobile
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary dark:bg-primary/20" 
                  : "text-text-secondary hover:bg-accent/50 dark:text-text-secondary-dark dark:hover:bg-accent/10"
              )}
            >
              <FontAwesomeIcon icon={item.icon} className={cn("w-5", isActive ? "text-primary" : "opacity-70")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-border p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Keluar
        </button>
      </div>
    </aside>
  );
}