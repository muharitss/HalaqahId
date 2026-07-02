import { type Sekolah } from "@/types/domain/sekolah";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, MapPin, Mail, Key, Phone, MessageCircle, Eye, Target, User, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProfilSekolahInfoProps {
  sekolah: Sekolah;
}

const JENIS_LEMBAGA_LABEL: Record<string, string> = {
  PESANTREN: "Pesantren",
  MADRASAH: "Madrasah",
  SEKOLAH_UMUM: "Sekolah Umum",
  TPA: "TPA / TPQ",
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

export const ProfilSekolahInfo = ({ sekolah }: ProfilSekolahInfoProps) => {
  const alamatLengkap = [
    sekolah.alamat,
    sekolah.kelurahan,
    sekolah.kecamatan,
    sekolah.kota,
    sekolah.provinsi,
    sekolah.kode_pos,
    sekolah.negara !== "Indonesia" ? sekolah.negara : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-4">
      {/* Card Header: Banner + Identity */}
      <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-primary/10">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary/40 relative">
          <div className="absolute -bottom-10 left-6">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md">
              {sekolah.logo_url && <AvatarImage src={sekolah.logo_url} alt={sekolah.nama_sekolah} />}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {sekolah.nama_sekolah.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardHeader className="pt-14 pb-4">
          <div className="flex flex-wrap items-start gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl leading-tight">
                {sekolah.nama_sekolah}
                {sekolah.nama_singkat && (
                  <span className="text-base font-normal text-muted-foreground ml-2">
                    ({sekolah.nama_singkat})
                  </span>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1">
                <Building2 className="w-4 h-4" /> Tenant Resmi Halaqah.id
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {sekolah.jenis_lembaga && (
                <Badge variant="secondary">
                  {JENIS_LEMBAGA_LABEL[sekolah.jenis_lembaga] ?? sekolah.jenis_lembaga}
                </Badge>
              )}
              {sekolah.jenjang && (
                <Badge variant="outline">{sekolah.jenjang}</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Deskripsi singkat */}
        {sekolah.deskripsi && (
          <CardContent className="pt-0 pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{sekolah.deskripsi}</p>
          </CardContent>
        )}
      </Card>

      {/* Card: Kontak & Lokasi */}
      <Card className="border-0 shadow-sm ring-1 ring-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Kontak & Lokasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={sekolah.email} />
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Telepon" value={sekolah.no_telepon} />
          <InfoRow icon={<MessageCircle className="w-4 h-4" />} label="WhatsApp" value={sekolah.whatsapp} />
          {alamatLengkap && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-muted-foreground shrink-0"><MapPin className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Alamat Lengkap</p>
                <p className="text-sm leading-relaxed">{alamatLengkap}</p>
              </div>
            </div>
          )}
          {!sekolah.email && !sekolah.no_telepon && !sekolah.whatsapp && !alamatLengkap && (
            <p className="text-sm text-muted-foreground italic">Belum ada informasi kontak & lokasi.</p>
          )}
        </CardContent>
      </Card>

      {/* Card: Pimpinan */}
      {(sekolah.kepala_sekolah || sekolah.jabatan_kepala) && (
        <Card className="border-0 shadow-sm ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pimpinan Lembaga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border shadow-sm">
                {sekolah.foto_kepala_url && <AvatarImage src={sekolah.foto_kepala_url} alt={sekolah.kepala_sekolah ?? ""} />}
                <AvatarFallback className="bg-muted">
                  <User className="w-6 h-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{sekolah.kepala_sekolah ?? "-"}</p>
                <p className="text-sm text-muted-foreground">{sekolah.jabatan_kepala ?? "Kepala Sekolah"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card: Visi & Misi */}
      {(sekolah.visi || sekolah.misi) && (
        <Card className="border-0 shadow-sm ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Visi & Misi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sekolah.visi && (
              <div className="flex items-start gap-3">
                <Eye className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Visi</p>
                  <p className="text-sm leading-relaxed">{sekolah.visi}</p>
                </div>
              </div>
            )}
            {sekolah.visi && sekolah.misi && <Separator />}
            {sekolah.misi && (
              <div className="flex items-start gap-3">
                <Target className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Misi</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{sekolah.misi}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Card: Slug Portal Publik */}
      <Card className="border-0 shadow-sm ring-1 ring-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="w-4 h-4" /> Slug Portal Publik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sekolah.slug ? (
            <>
              <div className="bg-muted/50 p-3 rounded-md font-mono text-sm border">
                {sekolah.slug}
              </div>
              <a
                href={`${window.location.origin}/display/${sekolah.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                {window.location.origin}/display/{sekolah.slug}
              </a>
            </>
          ) : (
            <div className="bg-muted/30 p-3 rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground italic">
                Slug belum diatur. Klik <strong>Edit Profil</strong> dan simpan untuk men-generate slug otomatis dari nama sekolah.
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Link ini digunakan wali santri untuk mengakses portal informasi publik sekolah Anda.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
