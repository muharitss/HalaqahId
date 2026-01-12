import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartPie, 
  faUsers, 
  faBook, 
  faClipboardCheck, 
  faUserTie,
  faSignOutAlt,
  faBookOpen,
  faTimes,
  faArrowLeft, 
  faUserShield 
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout, stopImpersonating, isImpersonating } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handler untuk kembali ke superadmin
  const handleBackToSuperadmin = async () => {
    await stopImpersonating();
    navigate("/kepala-muhafidz");
  };

  // Definisi Menu berdasarkan Role (Sesuai Flowchart)
  const menuItems = user?.role === "superadmin" 
    ? [
        { name: "Dashboard", path: "/kepala-muhafidz", icon: faChartPie },
        { name: "Kelola Muhafiz", path: "/kepala-muhafidz/muhafiz", icon: faUserTie },
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
          <div>
            <span className="text-xl font-bold tracking-tight dark:text-white font-display block">HalaqahId</span>
            {/* Tampilkan status impersonate */}
            {isImpersonating && (
              <span className="text-xs text-yellow-500 font-medium">Sebagai Muhafidz</span>
            )}
          </div>
        </div>
        
        {/* Tombol Close - Hanya muncul di mobile */}
        <button onClick={onClose} className="lg:hidden text-text-secondary dark:text-white">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Tombol Kembali ke Superadmin (hanya saat impersonate) */}
      {isImpersonating && (
        <div className="px-4 py-2">
          <Button
            onClick={handleBackToSuperadmin}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            size="sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Kembali ke Superadmin
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
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

      {/* User Info & Logout */}
      <div className="border-t border-border p-4">
        <div className="mb-3 px-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {isImpersonating ? (
                <FontAwesomeIcon icon={faUserTie} className="text-primary text-sm" />
              ) : user?.role === "superadmin" ? (
                <FontAwesomeIcon icon={faUserShield} className="text-primary text-sm" />
              ) : (
                <FontAwesomeIcon icon={faUserTie} className="text-primary text-sm" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium dark:text-white truncate">
                {user?.username}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {isImpersonating ? "Muhafidz" : user?.role === "superadmin" ? "Superadmin" : "Muhafidz"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          {isImpersonating ? "Logout dari Muhafidz" : "Keluar"}
        </button>
      </div>
    </aside>
  );
}