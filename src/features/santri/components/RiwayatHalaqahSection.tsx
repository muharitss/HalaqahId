import { useRiwayatHalaqah } from "../api/queries/useRiwayatHalaqah";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Term } from "@/components/ui/Term";
import { PermissionGate } from "@/components/ui/PermissionGate";
import {
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  History,
  Loader2,
  User as UserIcon,
} from "lucide-react";

export interface RiwayatHalaqahSectionProps {
  santriId: number;
  santriName?: string;
  onPindahHalaqahClick?: () => void;
}

export function RiwayatHalaqahSection({
  santriId,
  santriName,
  onPindahHalaqahClick,
}: RiwayatHalaqahSectionProps) {
  const { data: riwayatList = [], isLoading, error } = useRiwayatHalaqah(santriId);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Riwayat Perpindahan <Term code="HALAQAH" />
          </h3>
          <p className="text-xs text-muted-foreground">
            Daftar riwayat pergerakan {santriName ? <strong>{santriName}</strong> : "santri"} antar <Term code="HALAQAH" />.
          </p>
        </div>

        {onPindahHalaqahClick && (
          <PermissionGate permission="santri.update">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onPindahHalaqahClick}
              className="gap-2 shrink-0"
            >
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              Pindah <Term code="HALAQAH" />
            </Button>
          </PermissionGate>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <span className="text-xs">Memuat riwayat perpindahan...</span>
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 text-xs text-destructive text-center">
            {error.message || "Gagal memuat riwayat halaqah"}
          </CardContent>
        </Card>
      ) : riwayatList.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center bg-muted/20">
          <History className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-foreground">
            Belum Ada Riwayat Perpindahan
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {santriName || "Santri ini"} belum pernah dipindahkan dari <Term code="HALAQAH" /> awalnya.
          </p>
          {onPindahHalaqahClick && (
            <PermissionGate permission="santri.update">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                onClick={onPindahHalaqahClick}
              >
                <ArrowRightLeft className="h-4 w-4" />
                Pindahkan ke <Term code="HALAQAH" /> Baru
              </Button>
            </PermissionGate>
          )}
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-muted-foreground/20">
          {riwayatList.map((item, index) => {
            const halaqahLamaNama =
              item.halaqah_lama?.nama_halaqah ||
              item.halaqah_lama?.name_halaqah ||
              `Halaqah #${item.id_halaqah_lama}`;
            const halaqahBaruNama =
              item.halaqah_baru?.nama_halaqah ||
              item.halaqah_baru?.name_halaqah ||
              `Halaqah #${item.id_halaqah_baru}`;

            return (
              <div key={item.id_riwayat || index} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-6 top-1.5 h-5 w-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>

                <div className="bg-card border rounded-lg p-4 shadow-xs hover:border-primary/40 transition-colors space-y-3">
                  {/* Halaqah change header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-medium bg-muted/50 text-foreground">
                        {halaqahLamaNama}
                      </Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <Badge variant="secondary" className="font-semibold bg-primary/10 text-primary border-primary/20">
                        {halaqahBaruNama}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(item.tanggal_pindah)}</span>
                    </div>
                  </div>

                  {/* Alasan */}
                  {item.alasan ? (
                    <div className="text-xs bg-muted/40 rounded-md p-2.5 text-foreground/90 border border-muted/50">
                      <span className="font-semibold text-muted-foreground mr-1.5">Alasan:</span>
                      {item.alasan}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Tidak ada catatan alasan pemindahan.
                    </p>
                  )}

                  {/* Dipindahkan oleh */}
                  {item.user && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-dashed">
                      <UserIcon className="h-3 w-3" />
                      <span>
                        Dipindahkan oleh <strong>{item.user.name}</strong> ({item.user.role})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
