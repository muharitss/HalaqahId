import { type Sekolah } from "@/types/domain/sekolah";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Mail, Key } from "lucide-react";

interface ProfilSekolahInfoProps {
  sekolah: Sekolah;
}

export const ProfilSekolahInfo = ({ sekolah }: ProfilSekolahInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Sekolah</CardTitle>
        <CardDescription>
          Detail profil sekolah yang terdaftar di sistem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium leading-none mb-1">Nama Sekolah</p>
            <p className="text-sm text-muted-foreground">{sekolah.nama_sekolah}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium leading-none mb-1">Alamat</p>
            <p className="text-sm text-muted-foreground">
              {sekolah.alamat || <span className="italic">Belum diatur</span>}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium leading-none mb-1">Email</p>
            <p className="text-sm text-muted-foreground">
              {sekolah.email || <span className="italic">Belum diatur</span>}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium leading-none mb-1">Display Token</p>
            <p className="text-sm text-muted-foreground font-mono">{sekolah.display_token}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
