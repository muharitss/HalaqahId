import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type AbsensiStatus } from "@/services/absensiService";
import { Badge } from "@/components/ui/badge";

interface Props {
  santriList: any[];
  attendanceMap: Record<number, AbsensiStatus>;
  alreadySubmittedIds: number[];
  onStatusChange: (id: number, status: AbsensiStatus) => void;
}

export const InputAbsensi = ({ santriList, attendanceMap, alreadySubmittedIds, onStatusChange }: Props) => {
  return (
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Nama Santri</TableHead>
            <TableHead className="text-right pr-4">Kehadiran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {santriList.map((s) => {
            const isLocked = alreadySubmittedIds.includes(s.id_santri);
            
            return (
              <TableRow key={s.id_santri} className={isLocked ? "bg-muted/30" : ""}>
                <TableCell className="font-medium">
                  {s.nama_santri}
                  {isLocked && <Badge variant="outline" className="ml-2 text-[10px] text-primary">Tercatat</Badge>}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={isLocked}>
                      <Button 
                        variant={isLocked ? "secondary" : "outline"} 
                        size="sm" 
                        className="justify-between"
                      >
                        {attendanceMap[s.id_santri] || "Status"}
                        {!isLocked && <span className="ml-2 text-[10px]">▼</span>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-45">
                        {(["HADIR", "IZIN", "SAKIT", "TERLAMBAT", "ALFA"] as AbsensiStatus[]).map((st) => (
                        <DropdownMenuItem key={st} onClick={() => onStatusChange(s.id_santri, st)}>
                            {st}
                        </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
  );
};