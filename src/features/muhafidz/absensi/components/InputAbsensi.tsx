import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type AbsensiStatus } from "../types";
import { type Santri } from "@/features/muhafidz/kelola-santri/types";

interface Props {
  santriList: Santri[];
  attendanceMap: Record<number, AbsensiStatus>;      // Status draft (pilihan sementara)
  submittedAttendance: Record<number, AbsensiStatus>; // Status yang sudah ada di database
  onStatusChange: (id: number, status: AbsensiStatus) => void;
}

export const InputAbsensi = ({ 
  santriList, 
  attendanceMap, 
  submittedAttendance, 
  onStatusChange 
}: Props) => {
  
  if (!Array.isArray(santriList)) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Data santri tidak valid.</div>;
  }

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="font-bold">Nama Santri</TableHead>
          <TableHead className="text-right pr-4 font-bold">Kehadiran</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {santriList.map((s) => {
          const dbStatus = submittedAttendance[s.id_santri];
          const isSubmitted = !!dbStatus;
          
          const draftStatus = attendanceMap[s.id_santri];
          const isEditing = !!draftStatus;

          const displayStatus = draftStatus || dbStatus || "Status";
          
          return (
            <TableRow key={s.id_santri} className={cn(isSubmitted && !isEditing ? "bg-primary/[0.01]" : "")}>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm md:text-base">{s.nama_santri}</span>
                  
                  {isEditing && (
                    <Badge variant="outline" className="h-5 text-[9px] bg-amber-50 text-amber-600 border-amber-200 font-bold uppercase">
                      Draft
                    </Badge>
                  )}
                  {isSubmitted && !isEditing && (
                    <Badge variant="outline" className="h-5 text-[9px] bg-green-50 text-green-600 border-green-200 font-bold uppercase">
                      Tercatat
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant={isEditing ? "default" : isSubmitted ? "outline" : "outline"} 
                      size="sm" 
                      className={cn(
                        "w-36 justify-between text-xs font-bold uppercase tracking-tight shadow-sm",
                        isSubmitted && !isEditing && "border-primary/40 text-primary bg-primary/5"
                      )}
                    >
                      <span className="truncate">{displayStatus}</span>
                      <span className="ml-2 opacity-50">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 p-1.5">
                    {(["HADIR", "IZIN", "SAKIT", "TERLAMBAT", "ALFA"] as AbsensiStatus[]).map((st) => (
                      <DropdownMenuItem 
                        key={st} 
                        onClick={() => onStatusChange(s.id_santri, st)}
                        className={cn(
                          "cursor-pointer text-xs font-semibold py-2",
                          displayStatus === st ? "bg-primary text-primary-foreground" : ""
                        )}
                      >
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