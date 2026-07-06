import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Mail,
  Phone,
  Users,
  LayoutGrid,
  School,
  User,
  Calendar,
  UserCheck,
  Hash,
} from "lucide-react";
import type { SekolahWithCount } from "@/types/domain/sekolah";

interface SekolahDetailSheetProps {
  sekolah: SekolahWithCount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JENIS_LABEL: Record<string, string> = {
  PESANTREN: "Pesantren",
  MADRASAH: "Madrasah",
  SEKOLAH_UMUM: "Sekolah Umum",
  TPA: "TPA",
};

type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium break-all">{value}</p>
      </div>
    </div>
  );
}

const statItems = [
  { key: "santri" as const, label: "Santri", icon: Users },
  { key: "halaqah" as const, label: "Halaqah", icon: LayoutGrid },
  { key: "users" as const, label: "Pengguna", icon: UserCheck },
];

export function SekolahDetailSheet({
  sekolah,
  open,
  onOpenChange,
}: SekolahDetailSheetProps) {
  if (!sekolah) return null;

  const lokasi = [sekolah.kota, sekolah.provinsi].filter(Boolean).join(", ");
  const terdaftar = new Date(sekolah.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[460px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <School className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-left text-base leading-snug">
                {sekolah.nama_sekolah}
              </SheetTitle>
              {sekolah.nama_singkat && (
                <SheetDescription className="text-left text-xs mt-0.5">
                  {sekolah.nama_singkat}
                </SheetDescription>
              )}
              {sekolah.jenis_lembaga && (
                <Badge variant="secondary" className="mt-1 text-xs font-normal">
                  {JENIS_LABEL[sekolah.jenis_lembaga] ?? sekolah.jenis_lembaga}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5">
          {/* Statistik */}
          <div className="grid grid-cols-3 gap-3">
            {statItems.map(({ key, label, icon: Icon }) => (
              <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
                <Icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-xl font-bold leading-none">
                  {sekolah._count[key]}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Kontak & Lokasi */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Kontak &amp; Lokasi
            </p>
            <InfoRow icon={Mail} label="Email" value={sekolah.email} />
            <InfoRow icon={Phone} label="Telepon" value={sekolah.no_telepon} />
            <InfoRow icon={Phone} label="WhatsApp" value={sekolah.whatsapp} />
            <InfoRow
              icon={MapPin}
              label="Lokasi"
              value={lokasi || sekolah.alamat}
            />
            {sekolah.alamat && lokasi && (
              <InfoRow
                icon={MapPin}
                label="Alamat Lengkap"
                value={sekolah.alamat}
              />
            )}
          </div>

          {/* Kepemimpinan */}
          {(sekolah.kepala_sekolah || sekolah.jabatan_kepala) && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Kepemimpinan
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {sekolah.kepala_sekolah ?? "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sekolah.jabatan_kepala ?? "Kepala Sekolah"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Profil Lembaga */}
          {(sekolah.deskripsi || sekolah.visi) && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Profil Lembaga
                </p>
                {sekolah.deskripsi && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                    <p className="text-sm leading-relaxed">{sekolah.deskripsi}</p>
                  </div>
                )}
                {sekolah.visi && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Visi</p>
                    <p className="text-sm leading-relaxed italic">
                      &ldquo;{sekolah.visi}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-3">
            <InfoRow icon={Calendar} label="Terdaftar Sejak" value={terdaftar} />
            {sekolah.slug && (
              <InfoRow icon={Hash} label="Slug" value={sekolah.slug} />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
