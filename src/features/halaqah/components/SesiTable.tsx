import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import type { SesiHalaqah } from "@/types/domain/sesi-halaqah";

interface SesiTableProps {
  sesiList: SesiHalaqah[];
  isLoading: boolean;
  onEdit: (sesi: SesiHalaqah) => void;
  onDelete: (sesi: SesiHalaqah) => void;
}

export function SesiTable({ sesiList, isLoading, onEdit, onDelete }: SesiTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="text-muted-foreground">Memuat data sesi...</span>
      </div>
    );
  }

  if (sesiList.length === 0) {
    return (
      <div className="flex justify-center p-8 border rounded-md">
        <span className="text-muted-foreground">Tidak ada sesi halaqah yang tersedia.</span>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Sesi</TableHead>
            <TableHead>Jam Mulai</TableHead>
            <TableHead>Jam Selesai</TableHead>
            <TableHead>Halaqah</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sesiList.map((sesi) => {
            console.log(sesi)
            return (
            <TableRow key={sesi.id_sesi}>
              <TableCell className="font-medium">{sesi.nama_sesi}</TableCell>
              <TableCell>{sesi.jam_mulai}</TableCell>
              <TableCell>{sesi.jam_selesai}</TableCell>
              <TableCell>
                {sesi.halaqah?.name_halaqah || sesi.id_halaqah || <span className="text-muted-foreground italic">Tidak ada (Sesi Umum)</span>}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(sesi)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(sesi)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )})} 
        </TableBody>
      </Table>
    </div>
  );
}
