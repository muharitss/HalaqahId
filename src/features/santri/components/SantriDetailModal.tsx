import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Term } from "@/components/ui/Term";
import {
  User,
  Users,
  History,
  Phone,
  Target,
  Bookmark,
  Calendar,
  Pencil,
  ArrowRightLeft,
} from "lucide-react";
import { type Santri, STATUS_SANTRI_LABELS, type StatusSantri } from "../types";
import { SantriWaliSection } from "./SantriWaliSection";
import { RiwayatHalaqahSection } from "./RiwayatHalaqahSection";

interface HalaqahOption {
  id_halaqah: number;
  name_halaqah?: string;
  nama_halaqah?: string;
}

export interface SantriDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  santri: Santri | null;
  halaqahList: HalaqahOption[];
  initialTab?: "profil" | "wali" | "riwayat";
  onEditClick?: (santri: Santri) => void;
  onPindahHalaqahClick?: (santri: Santri) => void;
}

export function SantriDetailModal({
  isOpen,
  onClose,
  santri,
  halaqahList,
  initialTab = "profil",
  onEditClick,
  onPindahHalaqahClick,
}: SantriDetailModalProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  if (!santri) return null;

  const halaqahName =
    halaqahList.find((h) => h.id_halaqah === santri.id_halaqah)?.nama_halaqah ||
    halaqahList.find((h) => h.id_halaqah === santri.id_halaqah)?.name_halaqah ||
    santri.halaqah?.name_halaqah ||
    `Halaqah #${santri.id_halaqah}`;

  const getStatusBadge = (status?: StatusSantri) => {
    switch (status) {
      case "LULUS":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200">
            {STATUS_SANTRI_LABELS.LULUS}
          </Badge>
        );
      case "KELUAR":
        return (
          <Badge variant="destructive" className="bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200">
            {STATUS_SANTRI_LABELS.KELUAR}
          </Badge>
        );
      case "CUTI":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200">
            {STATUS_SANTRI_LABELS.CUTI}
          </Badge>
        );
      case "AKTIF":
      default:
        return (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200">
            {STATUS_SANTRI_LABELS.AKTIF}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {santri.nama_santri}
                </DialogTitle>
                {getStatusBadge(santri.status)}
              </div>
              <DialogDescription className="mt-1">
                NIS: {santri.nomor_induk_santri ? <span className="font-mono text-foreground font-semibold">{santri.nomor_induk_santri}</span> : <span className="italic text-muted-foreground">Belum diatur</span>} • <Term code="HALAQAH" />: <span className="font-semibold text-foreground">{halaqahName}</span>
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              {onPindahHalaqahClick && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPindahHalaqahClick(santri)}
                  className="gap-1.5 h-8 text-xs"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  Pindah <Term code="HALAQAH" />
                </Button>
              )}
              {onEditClick && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onEditClick(santri)}
                  className="gap-1.5 h-8 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Profil
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profil" className="gap-2 text-xs sm:text-sm">
                <User className="h-4 w-4" />
                Profil & Detail
              </TabsTrigger>
              <TabsTrigger value="wali" className="gap-2 text-xs sm:text-sm">
                <Users className="h-4 w-4" />
                Data Wali
              </TabsTrigger>
              <TabsTrigger value="riwayat" className="gap-2 text-xs sm:text-sm">
                <History className="h-4 w-4" />
                Riwayat <Term code="HALAQAH" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profil" className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Bookmark className="h-3.5 w-3.5 text-primary" />
                    Nomor Induk Santri (NIS)
                  </div>
                  <p className="font-semibold font-mono text-foreground text-sm">
                    {santri.nomor_induk_santri || <span className="text-muted-foreground font-normal italic">Belum ditentukan</span>}
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    Target Hafalan
                  </div>
                  <p className="font-semibold text-foreground text-sm">
                    {santri.target ? santri.target.nama_target : <span className="text-muted-foreground font-normal italic">Bebas (Tanpa Target)</span>}
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    Nomor Telepon
                  </div>
                  <p className="font-semibold text-foreground text-sm">
                    {santri.nomor_telepon ? (
                      <a
                        href={`https://wa.me/${santri.nomor_telepon.replace(/\D/g, "").replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {santri.nomor_telepon}
                      </a>
                    ) : (
                      <span className="text-muted-foreground font-normal italic">Tidak ada</span>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Tanggal Terdaftar
                  </div>
                  <p className="font-semibold text-foreground text-sm">
                    {santri.created_at ? new Date(santri.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wali" className="pt-2">
              <SantriWaliSection
                santriId={santri.id_santri}
                santriName={santri.nama_santri}
              />
            </TabsContent>

            <TabsContent value="riwayat" className="pt-2">
              <RiwayatHalaqahSection
                santriId={santri.id_santri}
                santriName={santri.nama_santri}
                onPindahHalaqahClick={() => onPindahHalaqahClick?.(santri)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
