import { useAuth } from "@/features/auth/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartPie, faUsers, faBook, faClipboardCheck, 
  faUserTie, faBookOpen, faBuilding, faClock
} from "@fortawesome/free-solid-svg-icons";
import { isKepalaRole, Role } from "@/types/domain/enums";

export function MobileDock() {
  const { user } = useAuth();
  const location = useLocation();

  const isSuperAdmin = user?.role === Role.SUPERADMIN;

  const menuItems = isSuperAdmin
    ? [
        { name: "Dash", path: "/superadmin", icon: faChartPie },
        { name: "Sekolah", path: "/superadmin/sekolah", icon: faBuilding },
      ]
    : user && isKepalaRole(user.role)
    ? [
        { name: "Dash", path: "/kepala-muhafidz", icon: faChartPie },
        { name: "Muhafiz", path: "/kepala-muhafidz/muhafiz", icon: faUserTie },
        { name: "Halaqah", path: "/kepala-muhafidz/halaqah", icon: faBook },
        { name: "Sesi", path: "/kepala-muhafidz/sesi", icon: faClock },
        { name: "Laporan", path: "/kepala-muhafidz/laporan", icon: faClipboardCheck },
      ]
    : [
        { name: "Absen", path: "/muhafidz", icon: faClipboardCheck },
        { name: "Setoran", path: "/muhafidz/setoran", icon: faBookOpen },
        { name: "Santri", path: "/muhafidz/santri", icon: faUsers },
        { name: "Progres", path: "/muhafidz/progres", icon: faChartPie },
      ];

  return (
    <div className="dock fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.name} 
            to={item.path}
            className={`${isActive ? "dock-active text-primary" : "text-muted-foreground"}`}
          >
            <FontAwesomeIcon icon={item.icon} className="size-5" />
            <span className="dock-label text-[10px]">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}