import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/features/auth/components/auth-provider";
import { isKepalaRole, Role } from "@/types/domain/enums";
import { useTerminology } from "@/lib/hooks/useTerminology";

export interface BreadcrumbCrumb {
  label: React.ReactNode;
  href?: string;
}

export interface AppBreadcrumbProps {
  items?: BreadcrumbCrumb[];
  className?: string;
}

export function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  const location = useLocation();
  const { user } = useAuth();

  const labelSantri = useTerminology("SANTRI");
  const labelHalaqah = useTerminology("HALAQAH");
  const labelMuhafiz = useTerminology("MUHAFIZ");
  const labelSekolah = useTerminology("SEKOLAH");

  // Tentukan path beranda berdasarkan role
  const homePath =
    user?.role === Role.SUPERADMIN
      ? "/superadmin"
      : user && isKepalaRole(user.role)
      ? "/kepala-muhafidz"
      : "/muhafidz";

  // Kamus label segmen URL ke Bahasa Indonesia (termasuk terminologi dinamis)
  const segmentLabels: Record<string, React.ReactNode> = {
    // Root roles
    superadmin: "Beranda",
    "kepala-muhafidz": "Beranda",
    muhafidz: "Beranda",

    // Sub-halaman
    settings: "Pengaturan",
    info: "Informasi & SOP",
    trash: "Tempat Sampah",
    kategori: "Kategori Setoran",
    target: `Target Setoran ${labelSantri}`,
    ujian: "Pengaturan Ujian",
    "form-setoran": "Form Setoran",
    terminology: "Terminologi Lembaga",
    rubrik: "Rubrik Penilaian",
    roles: "Kelola Role",
    users: "Kelola Pengguna",
    sekolah: `Kelola ${labelSekolah}`,
    "profil-sekolah": `Profil ${labelSekolah}`,
    profil: "Profil Pengguna",
    tenants: "Kelola Tenant",
    brand: "Branding",
    "audit-logs": "Audit Logs",
    blog: "Kelola Blog",
    muhafiz: `Kelola ${labelMuhafiz}`,
    halaqah: `Kelola ${labelHalaqah}`,
    sesi: "Kelola Sesi",
    absensi: "Absensi",
    izin: `Izin ${labelSantri}`,
    setoran: "Setoran",
    mushaf: "Mushaf Al-Qur'an",
    laporan: "Laporan Setoran",
    progress: "Progress Hafalan",
    "progress-hafalan": "Peta Hafalan",
    progres: `Progres ${labelSantri}`,
    leaderboard: "Leaderboard",
    tahfidzai: "Tahfidz AI",
    akademik: "Kalender Akademik",
    "hari-libur": "Hari Libur",
    program: "Program Tahfidz",
    pengumuman: "Pengumuman",
    santri: `Kelola ${labelSantri}`,
  };

  // Jika items diberikan secara manual, gunakan items tersebut
  if (items && items.length > 0) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Jika di halaman dashboard utama, tidak perlu breadcrumb (bersih & rapi)
  const pathname = location.pathname.replace(/\/+$/, "");
  if (
    pathname === homePath ||
    pathname === "/dashboard" ||
    pathname === "" ||
    pathname === "/"
  ) {
    return null;
  }

  // Generate otomatis dari pathname
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  // Root role prefix (e.g. 'superadmin' | 'kepala-muhafidz' | 'muhafidz')
  const rootRolePrefix = segments[0];
  const isDashboardRoute = ["superadmin", "kepala-muhafidz", "muhafidz"].includes(
    rootRolePrefix
  );

  const crumbs: BreadcrumbCrumb[] = [];

  if (isDashboardRoute) {
    // Crumb pertama: Beranda
    crumbs.push({
      label: (
        <span className="flex items-center gap-1.5">
          <Home className="h-3.5 w-3.5" />
          <span>Beranda</span>
        </span>
      ),
      href: `/${rootRolePrefix}`,
    });

    let cumulativePath = `/${rootRolePrefix}`;
    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      cumulativePath += `/${seg}`;
      const isLast = i === segments.length - 1;

      let label: React.ReactNode = segmentLabels[seg];
      if (!label) {
        if (/^\d+$/.test(seg)) {
          label = `Detail #${seg}`;
        } else {
          label = seg
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
        }
      }

      crumbs.push({
        label,
        href: isLast ? undefined : cumulativePath,
      });
    }
  } else {
    // Rute lain (misal public/portal)
    let cumulativePath = "";
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      cumulativePath += `/${seg}`;
      const isLast = i === segments.length - 1;

      let label: React.ReactNode = segmentLabels[seg] || seg;
      crumbs.push({
        label,
        href: isLast ? undefined : cumulativePath,
      });
    }
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                {isLast || !crumb.href ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
