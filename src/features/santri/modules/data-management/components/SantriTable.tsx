import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { type Santri, STATUS_SANTRI_LABELS, type StatusSantri } from "@/features/santri/types";
import { type Halaqah } from "@/features/halaqah/api/halaqahService";
import type { TargetSekolah } from "@/types/domain/target";
import { Term } from "@/components/ui/Term";
import { PermissionGate } from "@/components/ui/PermissionGate";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Phone,
  Eye,
  ArrowRightLeft,
  Users,
} from "lucide-react";

interface SantriTableProps {
  data: Santri[];
  searchTerm: string;
  isAdmin: boolean;
  halaqahList: Halaqah[];
  onEdit: (santri: Santri) => void;
  onDelete: (santri: Santri) => void;
  onViewDetail?: (santri: Santri) => void;
  onPindahHalaqah?: (santri: Santri) => void;
  onManageWali?: (santri: Santri) => void;
}

export function SantriTable({
  data,
  searchTerm,
  isAdmin,
  halaqahList,
  onEdit,
  onDelete,
  onViewDetail,
  onPindahHalaqah,
  onManageWali,
}: SantriTableProps) {
  const renderTargetBadge = (target?: TargetSekolah | null) => {
    if (!target) {
      return (
        <Badge variant="outline" className="font-normal text-muted-foreground">
          Bebas
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="font-medium bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-900/50">
        {target.nama_target}
      </Badge>
    );
  };

  const renderStatusBadge = (status?: StatusSantri) => {
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

  const formatWhatsApp = (phone: string | null | undefined) => {
    if (!phone) return "#";

    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-bold text-foreground w-[12%] min-w-[110px]">
              NIS
            </TableHead>
            <TableHead className="font-bold text-foreground w-[24%] min-w-[150px]">
              Nama <Term code="SANTRI" />
            </TableHead>
            <TableHead className="font-bold text-foreground w-[10%] min-w-[90px]">
              Status
            </TableHead>
            <TableHead className="font-bold text-foreground w-[18%] min-w-[130px]">
              Nomor Telepon
            </TableHead>
            <TableHead className="font-bold text-foreground w-[16%] min-w-[110px]">Target</TableHead>
            {isAdmin && (
              <TableHead className="font-bold text-foreground w-[12%] min-w-[110px]">
                <Term code="HALAQAH" />
              </TableHead>
            )}
            <TableHead className="text-right font-bold text-foreground w-[8%] min-w-[70px]">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isAdmin ? 7 : 6}
                className="text-center py-12 text-muted-foreground"
              >
                {searchTerm ? (
                  <p>
                    Tidak ada <Term code="SANTRI" /> yang sesuai dengan pencarian{" "}
                    <span className="font-semibold">"{searchTerm}"</span>
                  </p>
                ) : (
                  <p>Belum ada data <Term code="SANTRI" /></p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            data.map((santri) => (
              <TableRow
                key={santri.id_santri}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                  {santri.nomor_induk_santri ? (
                    <span className="text-foreground">{santri.nomor_induk_santri}</span>
                  ) : (
                    <span className="italic">-</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {santri.nama_santri}
                </TableCell>
                <TableCell>
                  {renderStatusBadge(santri.status)}
                </TableCell>
                <TableCell>
                  {santri.nomor_telepon ? (
                    <a
                      href={formatWhatsApp(santri.nomor_telepon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary-dark hover:underline transition-all text-xs md:text-sm"
                    >
                      <Phone className="h-3 w-3" />
                      {santri.nomor_telepon}
                    </a>
                  ) : (
                    <span className="text-xs md:text-sm text-muted-foreground italic">-</span>
                  )}
                </TableCell>
                <TableCell>{renderTargetBadge(santri.target)}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {halaqahList.find((h) => h.id_halaqah === santri.id_halaqah)
                        ?.name_halaqah || `Halaqah ${santri.id_halaqah}`}
                    </span>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Opsi Santri</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {onViewDetail && (
                          <DropdownMenuItem onClick={() => onViewDetail(santri)}>
                            <Eye className="mr-2 h-3.5 w-3.5 text-primary" />
                            <span>Detail & Riwayat</span>
                          </DropdownMenuItem>
                        )}
                        <PermissionGate permission="santri.update">
                          {onPindahHalaqah && (
                            <DropdownMenuItem onClick={() => onPindahHalaqah(santri)}>
                              <ArrowRightLeft className="mr-2 h-3.5 w-3.5 text-blue-600" />
                              <span>Pindah Halaqah</span>
                            </DropdownMenuItem>
                          )}
                          {onManageWali && (
                            <DropdownMenuItem onClick={() => onManageWali(santri)}>
                              <Users className="mr-2 h-3.5 w-3.5" />
                              <span>Data Wali</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onEdit(santri)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            <span>Edit Profil</span>
                          </DropdownMenuItem>
                        </PermissionGate>
                        <PermissionGate permission="santri.delete">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(santri)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            <span>Hapus Santri</span>
                          </DropdownMenuItem>
                        </PermissionGate>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
