import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Sekolah } from "@/types/domain/sekolah";
import { sekolahService } from "../api/services/sekolahService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Building2, MapPin, Mail, Key, Phone, MessageCircle, Eye, Target, User, ExternalLink, RefreshCw, Copy, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage } from "@/utils/error";

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
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const displayUrl = sekolah.slug
    ? `${window.location.origin}/display/${sekolah.slug}${sekolah.display_token ? `?token=${sekolah.display_token}` : ""}`
    : "";

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
            <div className="h-20 w-32 border-4 border-background bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-1.5">
              {sekolah.logo_url ? (
                <img
                  src={sekolah.logo_url}
                  alt={sekolah.nama_sekolah}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="bg-primary/10 text-primary w-full h-full flex items-center justify-center text-xl font-bold rounded-lg">
                  {sekolah.nama_sekolah.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
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

      {/* Card: Layar Kelas & Display Publik */}
      <Card className="border-0 shadow-sm ring-1 ring-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Layar Kelas & Display Publik
            </span>
            {sekolah.display_token && (
              <Badge variant="outline" className="font-mono text-[10px]">
                Token Aktif
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Gunakan tautan berotentikasi ini untuk menampilkan data progres pada Smart TV atau layar kelas sekolah.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sekolah.slug ? (
            <>
              {/* Display URL with token */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">URL Display Layar Kelas</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted/50 p-2.5 rounded-md font-mono text-xs border truncate">
                    {displayUrl}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      if (!displayUrl) return;
                      await navigator.clipboard.writeText(displayUrl);
                      setCopied(true);
                      toast.success("Link display berhasil disalin!");
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? "Tersalin" : "Salin Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    asChild
                  >
                    <a
                      href={displayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Buka
                    </a>
                  </Button>
                </div>
              </div>

              {/* Display Token & Rotation */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Rotasi Token Keamanan Display</p>
                  <p className="text-[11px] text-muted-foreground">
                    Jika link display bocor atau ingin memutus akses TV lama, rotasi token di sini.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRotating}
                      className="text-destructive hover:text-destructive shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRotating ? "animate-spin" : ""}`} /> Rotasi Token
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Rotasi Display Token?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini akan membuat token display baru. Layar kelas atau perangkat TV yang sedang aktif akan terputus dan wajib diperbarui menggunakan tautan baru.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            setIsRotating(true);
                            await sekolahService.rotateDisplayToken();
                            await queryClient.invalidateQueries({ queryKey: ["profil-sekolah"] });
                            toast.success("Display token berhasil dirotasi!");
                          } catch (err) {
                            toast.error(getErrorMessage(err, "Gagal merotasi display token"));
                          } finally {
                            setIsRotating(false);
                          }
                        }}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Ya, Rotasi Token
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          ) : (
            <div className="bg-muted/30 p-3 rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground italic">
                Slug belum diatur. Klik <strong>Edit Profil</strong> dan simpan untuk membuat slug sekolah terlebih dahulu.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
