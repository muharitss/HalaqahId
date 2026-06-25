import { type Sekolah } from "@/types/domain/sekolah";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, MapPin, Mail, Key } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ProfilSekolahInfoProps {
  sekolah: Sekolah;
}

export const ProfilSekolahInfo = ({ sekolah }: ProfilSekolahInfoProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-primary/10">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-primary/80 to-primary/40 relative">
        <div className="absolute -bottom-10 left-6">
          <Avatar className="h-20 w-20 border-4 border-background shadow-md">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {sekolah.nama_sekolah.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <CardHeader className="pt-14 pb-4">
        <CardTitle className="text-2xl">{sekolah.nama_sekolah}</CardTitle>
        <CardDescription className="text-base flex items-center gap-1.5 mt-1">
          <Building2 className="w-4 h-4" /> Tenant Resmi Halaqah.id
        </CardDescription>
      </CardHeader>
      
      <Separator className="mx-6 w-auto" />
      
      <CardContent className="pt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
            <MapPin className="w-4 h-4" /> Alamat Lengkap
          </div>
          <p className="text-sm leading-relaxed">
            {sekolah.alamat || <span className="italic text-muted-foreground">Belum diatur</span>}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
            <Mail className="w-4 h-4" /> Email Sekolah
          </div>
          <p className="text-sm font-medium">
            {sekolah.email || <span className="italic text-muted-foreground">Belum diatur</span>}
          </p>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
            <Key className="w-4 h-4" /> Display Token (Portal Publik)
          </div>
          <div className="bg-muted/50 p-3 rounded-md font-mono text-sm border flex items-center justify-between">
            <span>{sekolah.display_token}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Token ini digunakan untuk mengakses portal informasi publik sekolah Anda.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
