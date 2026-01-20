import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge, getStatusConfig, type AbsensiStatus } from "./StatusBadge";
import { ChevronDown } from "lucide-react";

interface AbsensiTableProps {
  rows: any[];
  onStatusChange: (id: number, status: AbsensiStatus) => void;
}

const STATUS_OPTIONS: AbsensiStatus[] = ["HADIR", "IZIN", "SAKIT", "TERLAMBAT", "ALFA"];

export function AbsensiTable({ rows, onStatusChange }: AbsensiTableProps) {
  console.log("Rows data saat ini:", rows);
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Santri</TableHead>
            <TableHead>Status Kehadiran</TableHead>
            <TableHead>Setoran Terakhir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.santri_id}>
              <TableCell>
                <div className={`h-2 w-2 rounded-full ${getStatusConfig(row.status).color} mx-auto`} />
              </TableCell>
              <TableCell className="font-medium">{row.namaSantri}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <StatusBadge status={row.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronDown className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {STATUS_OPTIONS.map((opt) => (
                        <DropdownMenuItem key={opt} onClick={() => {
                          console.log("Mengubah ID:", row.santri_id, "ke:", opt);
                          onStatusChange(row.santri_id, opt);
                        }}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getStatusConfig(opt).color}`} />
                            {opt}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {row.setoranTerakhir ? `${row.setoranTerakhir.surah} (${row.setoranTerakhir.ayat_mulai}-${row.setoranTerakhir.ayat_selesai})` : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}