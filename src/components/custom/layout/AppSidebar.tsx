import { useAuth } from "@/features/auth/components/auth-provider";
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
  faArrowLeft,
  faUserShield,
  faBuilding,
  faClock,
  faGear,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect } from "react";
import { isKepalaRole, Role } from "@/types/domain/enums";

import { useTenant } from "@/store/tenant-context";
import { useTerminology } from "@/lib/hooks/useTerminology";
import { Term } from "@/components/ui/Term";

export function AppSidebar() {
  const { user, logout, stopImpersonating, isImpersonating } = useAuth();
  const { brand } = useTenant();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  const handleBackToSuperadmin = async () => {
    const originalRole = user?.originalUser?.role;
    await stopImpersonating();
    
    if (originalRole === Role.SUPERADMIN) {
      navigate("/superadmin");
    } else {
      navigate("/kepala-muhafidz");
    }
  };

  const isSuperAdmin = user?.role === Role.SUPERADMIN;

  const settingsPath = isSuperAdmin
    ? "/superadmin/settings"
    : user && isKepalaRole(user.role)
      ? "/kepala-muhafidz/settings"
      : "/muhafidz/settings";

  const labelSantri = useTerminology("SANTRI");
  const labelHalaqah = useTerminology("HALAQAH");
  const labelMuhafiz = useTerminology("MUHAFIZ");
  const labelSekolah = useTerminology("SEKOLAH");

  const menuItems = isSuperAdmin
    ? [
        { name: "Dashboard", tooltip: "Dashboard", path: "/superadmin", icon: faChartPie },
        {
          name: <>Kelola <Term code="SEKOLAH" /></>,
          tooltip: `Kelola ${labelSekolah}`,
          path: "/superadmin/sekolah",
          icon: faBuilding,
        },
        {
          name: "Kelola Pengguna",
          tooltip: "Kelola Pengguna",
          path: "/superadmin/users",
          icon: faUsers,
        },
        {
          name: "Audit Logs",
          tooltip: "Audit Logs",
          path: "/superadmin/audit-logs",
          icon: faClock,
        },
        {
          name: "Kelola Blog",
          tooltip: "Kelola Blog",
          path: "/superadmin/blog",
          icon: faBook,
        },
      ]
    : user && isKepalaRole(user.role)
      ? [
          { name: "Dashboard", tooltip: "Dashboard", path: "/kepala-muhafidz", icon: faChartPie },
          {
            name: <>Kelola <Term code="MUHAFIZ" /></>,
            tooltip: `Kelola ${labelMuhafiz}`,
            path: "/kepala-muhafidz/muhafiz",
            icon: faUserTie,
          },
          {
            name: <>Kelola <Term code="HALAQAH" /></>,
            tooltip: `Kelola ${labelHalaqah}`,
            path: "/kepala-muhafidz/halaqah",
            icon: faBook,
          },
          { name: "Kelola Sesi", tooltip: "Kelola Sesi", path: "/kepala-muhafidz/sesi", icon: faClock },
          {
            name: "Lihat Laporan",
            tooltip: "Lihat Laporan",
            path: "/kepala-muhafidz/laporan",
            icon: faClipboardCheck,
          },
          {
            name: "Leaderboard",
            tooltip: "Leaderboard",
            path: "/kepala-muhafidz/leaderboard",
            icon: faTrophy,
          },
        ]
      : [
          {
            name: "Dashboard",
            tooltip: "Dashboard",
            path: "/muhafidz",
            icon: faChartPie,
          },
          {
            name: "Absensi Hari Ini",
            tooltip: "Absensi Hari Ini",
            path: "/muhafidz/absensi",
            icon: faClipboardCheck,
          },
          {
            name: "Input Setoran",
            tooltip: "Input Setoran",
            path: "/muhafidz/setoran",
            icon: faBookOpen,
          },
          {
            name: <>Kelola <Term code="SANTRI" /></>,
            tooltip: `Kelola ${labelSantri}`,
            path: "/muhafidz/santri",
            icon: faUsers,
          },
          {
            name: <>Progres <Term code="SANTRI" /></>,
            tooltip: `Progres ${labelSantri}`,
            path: "/muhafidz/progres",
            icon: faChartPie,
          },
          {
            name: "Leaderboard",
            tooltip: "Leaderboard",
            path: "/muhafidz/leaderboard",
            icon: faTrophy,
          },
        ];

  return (
    <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="h-16 border-b flex flex-row items-center gap-3">
        {brand?.logo_url ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-background">
            <img src={brand.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
          </div>
        )}
        <div className="flex flex-col overflow-hidden whitespace-nowrap group-data-[collapsible=icon]:hidden">
          <span className="font-bold tracking-tight">{brand?.nama_aplikasi || "HalaqahId"}</span>
          {isImpersonating && (
            <span className="text-[10px] text-yellow-500 font-semibold uppercase">
              Muhafidz Mode
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {isImpersonating && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
              <SidebarMenuButton
                onClick={handleBackToSuperadmin}
                className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 hover:text-yellow-700"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>
                  {user?.originalUser?.role === Role.SUPERADMIN
                    ? "Kembali ke Superadmin"
                    : "Kembali ke Admin"}
                </span>
              </SidebarMenuButton>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.tooltip || (item.name as any)}
                    >
                      <Link to={item.path}>
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:hidden">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FontAwesomeIcon
                  icon={
                    user?.role === Role.SUPERADMIN ? faUserShield : faUserTie
                  }
                  className="text-primary"
                />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden text-left">
                <span className="text-sm font-medium truncate">
                  {user?.name}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user?.role?.toLowerCase()}
                </span>
              </div>
            </div>
            <SidebarMenuButton
              asChild
              isActive={
                location.pathname === settingsPath ||
                location.pathname.startsWith(settingsPath + "/")
              }
              tooltip="Pengaturan"
            >
              <Link to={settingsPath}>
                <FontAwesomeIcon icon={faGear} />
                <span>Pengaturan</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              onClick={logout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
