import { useAuth } from "@/features/auth/components/auth-provider";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Term } from "@/components/ui/Term";
import {
  faChartPie,
  faUsers,
  faBook,
  faClipboardCheck,
  faUserTie,
  faBookOpen,
  faBuilding,
  faClock,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { isKepalaRole, Role } from "@/types/domain/enums";
import { cn } from "@/lib/utils";

export function MobileDock() {
  const { user } = useAuth();
  const location = useLocation();

  const isSuperAdmin = user?.role === Role.SUPERADMIN;

  const menuItems = isSuperAdmin
    ? [
        { name: "Dash", path: "/superadmin", icon: faChartPie },
        { name: <Term code="SEKOLAH" />, path: "/superadmin/sekolah", icon: faBuilding },
        { name: "Pengguna", path: "/superadmin/users", icon: faUsers },
        { name: "Audit", path: "/superadmin/audit-logs", icon: faClock },
      ]
    : user && isKepalaRole(user.role)
      ? [
          { name: "Dash", path: "/kepala-muhafidz", icon: faChartPie },
          { name: <Term code="MUHAFIZ" />, path: "/kepala-muhafidz/muhafiz", icon: faUserTie },
          { name: <Term code="HALAQAH" />, path: "/kepala-muhafidz/halaqah", icon: faBook },
          { name: "Sesi", path: "/kepala-muhafidz/sesi", icon: faClock },
          { name: "Laporan", path: "/kepala-muhafidz/laporan", icon: faClipboardCheck },
        ]
      : [
          { name: "Dash", path: "/muhafidz", icon: faChartPie },
          { name: "Absen", path: "/muhafidz/absensi", icon: faClipboardCheck },
          { name: "Setoran", path: "/muhafidz/setoran", icon: faBookOpen },
          { name: <Term code="SANTRI" />, path: "/muhafidz/santri", icon: faUsers },
          { name: "Progres", path: "/muhafidz/progres", icon: faChartLine },
        ];

  return (
    <div className="dock fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border/50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
      {menuItems.map((item) => {
        const isDashboard = [
          "/superadmin",
          "/kepala-muhafidz",
          "/muhafidz",
        ].includes(item.path);
        const isActive = isDashboard
          ? location.pathname === item.path
          : location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "transition-all duration-200 ease-in-out",
              isActive ? "dock-active text-primary scale-105" : "text-muted-foreground/80 hover:text-foreground"
            )}
          >
            <FontAwesomeIcon icon={item.icon} className={cn("size-5 transition-transform duration-200", isActive && "scale-110")} />
            <span className="dock-label text-[10px] tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
