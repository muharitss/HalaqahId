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

export function AppSidebar() {
  const { user, logout, stopImpersonating, isImpersonating } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  const handleBackToSuperadmin = async () => {
    await stopImpersonating();
    navigate("/kepala-muhafidz");
  };

  const isSuperAdmin = user?.role === Role.SUPERADMIN;

  const menuItems = isSuperAdmin
    ? [
        { name: "Dashboard", path: "/superadmin", icon: faChartPie },
        {
          name: "Kelola Sekolah",
          path: "/superadmin/sekolah",
          icon: faBuilding,
        },
      ]
    : user && isKepalaRole(user.role)
      ? [
          { name: "Dashboard", path: "/kepala-muhafidz", icon: faChartPie },
          {
            name: "Kelola Muhafiz",
            path: "/kepala-muhafidz/muhafiz",
            icon: faUserTie,
          },
          {
            name: "Kelola Halaqah",
            path: "/kepala-muhafidz/halaqah",
            icon: faBook,
          },
          { name: "Kelola Sesi", path: "/kepala-muhafidz/sesi", icon: faClock },
          {
            name: "Lihat Laporan",
            path: "/kepala-muhafidz/laporan",
            icon: faClipboardCheck,
          },
        ]
      : [
          {
            name: "Absensi Hari Ini",
            path: "/muhafidz",
            icon: faClipboardCheck,
          },
          {
            name: "Input Setoran",
            path: "/muhafidz/setoran",
            icon: faBookOpen,
          },
          { name: "Kelola Santri", path: "/muhafidz/santri", icon: faUsers },
          {
            name: "Progres Santri",
            path: "/muhafidz/progres",
            icon: faChartPie,
          },
        ];

  return (
    <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="h-16 border-b flex flex-row items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
          <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
        </div>
        <div className="flex flex-col overflow-hidden whitespace-nowrap group-data-[collapsible=icon]:hidden">
          <span className="font-bold tracking-tight">HalaqahId</span>
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
                <span>Kembali ke Admin</span>
              </SidebarMenuButton>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.name}
                  >
                    <Link to={item.path}>
                      <FontAwesomeIcon icon={item.icon} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
