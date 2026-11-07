import { format, differenceInCalendarDays } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, ClipboardList, Calendar, UserCheck } from "lucide-react";
import { Term } from "@/components/ui/Term";
import { IzinStatusBadge, IzinJenisBadge } from "./IzinStatusBadge";
import { StatusIzin, type IzinSantri } from "../types";

interface IzinTableProps {
  data: IzinSantri[];
  isLoading: boolean;
  canApprove: boolean;
  onApprove: (item: IzinSantri) => void;
  onReject: (item: IzinSantri) => void;
}

export function IzinTable({
  data,
  isLoading,
  canApprove,
  onApprove,
  onReject,
}: IzinTableProps) {
  const formatDateSafe = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: idLocale });
    } catch {
      return dateStr;
    }
  };

  const getDurationDays = (startDate: string, endDate: string) => {
    try {
      const days = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;
      return days > 0 ? days : 1;
    } catch {
      return 1;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-card p-12 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-2 text-sm text-muted-foreground">Memuat data izin...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card/50 p-12 text-center">
        <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
        <h3 className="font-semibold text-base">Tidak ada data izin santri</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Belum ada pengajuan izin yang sesuai dengan filter atau kriteria yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Term code="SANTRI" /></TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Periode Izin</TableHead>
            <TableHead className="max-w-[280px]">Alasan</TableHead>
            <TableHead>Status</TableHead>
            {canApprove && <TableHead className="text-right">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const duration = getDurationDays(item.tanggal_mulai, item.tanggal_selesai);
            const isPending = item.status === StatusIzin.PENDING;

            return (
              <TableRow key={item.id_izin} className="hover:bg-muted/40 transition-colors">
                {/* Santri Info */}
                <TableCell>
                  <div className="font-medium text-foreground">
                    {item.santri?.nama_santri || `Santri #${item.id_santri}`}
                  </div>
                  {item.santri?.nomor_induk_santri && (
                    <div className="text-xs text-muted-foreground">
                      NIS: {item.santri.nomor_induk_santri}
                    </div>
                  )}
                </TableCell>

                {/* Jenis */}
                <TableCell>
                  <IzinJenisBadge jenis={item.jenis} />
                </TableCell>

                {/* Periode */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>
                      {formatDateSafe(item.tanggal_mulai)}
                      {item.tanggal_mulai !== item.tanggal_selesai && ` - ${formatDateSafe(item.tanggal_selesai)}`}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Durasi: {duration} hari
                  </div>
                </TableCell>

                {/* Alasan */}
                <TableCell className="max-w-[280px]">
                  <p className="text-sm text-foreground line-clamp-2" title={item.alasan}>
                    {item.alasan}
                  </p>
                  {item.catatan_approval && (
                    <p className="text-xs text-muted-foreground mt-1 italic border-l-2 border-border pl-2">
                      Catatan: {item.catatan_approval}
                    </p>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="space-y-1">
                    <IzinStatusBadge status={item.status} />
                    {item.approver && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <UserCheck className="w-3 h-3" />
                        <span>{item.approver.name}</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                {canApprove && (
                  <TableCell className="text-right">
                    {isPending ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onApprove(item)}
                          className="h-8 px-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 dark:border-emerald-800"
                          title="Setujui Izin"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Setujui
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReject(item)}
                          className="h-8 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                          title="Tolak Izin"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Tolak
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Selesai</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
