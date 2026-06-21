import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Muhafiz, AbsensiStatus } from "../types";

interface Props {
  muhafizList: Muhafiz[];
  attendanceMap: Record<number, AbsensiStatus>;      // Status draft (pilihan user yang belum disave)
  submittedAttendance: Record<number, AbsensiStatus>; // Status asli dari database
  onStatusChange: (id: number, status: AbsensiStatus) => void;
}

export const InputAbsensiAsatidz = ({ 
  muhafizList, 
  attendanceMap, 
  submittedAttendance, 
  onStatusChange 
}: Props) => {
  
  // Debug untuk cek apakah data prop sampai ke sini
  console.log("PROP SUBMITTED:", submittedAttendance);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="text-xs md:text-sm font-bold h-12">Nama Muhafiz</TableHead>
            <TableHead className="text-right pr-6 text-xs md:text-sm font-bold h-12">Kehadiran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {muhafizList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                Tidak ada data muhafiz.
              </TableCell>
            </TableRow>
          ) : (
            muhafizList.map((m) => {
              // 1. Ambil status dari database (jika ada)
              const dbStatus = submittedAttendance[m.id_user];
              const isSubmitted = !!dbStatus;

              // 2. Ambil status dari draft (jika user sedang memilih/mengubah)
              const draftStatus = attendanceMap[m.id_user];
              const isEditing = !!draftStatus;

              // 3. LOGIKA TEXT TOMBOL (URUTAN PRIORITAS):
              // Tampilkan draft dulu (pilihan user saat ini)
              // Kalau tidak ada draft, tampilkan dari database
              // Kalau tidak ada dua-duanya, tampilkan "PILIH STATUS"
              const displayStatus = draftStatus || dbStatus || "Pilih Status";

              return (
                <TableRow key={m.id_user} className={isSubmitted ? "bg-primary/[0.02]" : ""}>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm md:text-base tracking-tight">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.email}</span>
                      </div>
                      
                      {/* Badge Indikator Status */}
                      {isEditing && (
                        <Badge variant="outline" className="h-5 text-[10px] bg-amber-50 text-amber-600 border-amber-200 font-bold uppercase tracking-tighter">
                          Draft
                        </Badge>
                      )}
                      {isSubmitted && !isEditing && (
                        <Badge variant="outline" className="h-5 text-[10px] bg-green-50 text-green-600 border-green-200 font-bold uppercase tracking-tighter">
                          Tercatat
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant={isEditing ? "default" : isSubmitted ? "outline" : "outline"}
                          size="sm" 
                          className={`w-40 justify-between uppercase text-xs font-bold tracking-tight shadow-sm ${
                            isSubmitted && !isEditing ? 'border-primary/40 text-primary bg-primary/5' : ''
                          }`}
                        >
                          <span className="truncate">{displayStatus}</span>
                          <span className="ml-2 opacity-50">▼</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-2">
                        {(["HADIR", "IZIN", "SAKIT", "TERLAMBAT", "ALFA"] as AbsensiStatus[]).map((st) => (
                          <DropdownMenuItem 
                            key={st} 
                            onClick={() => onStatusChange(m.id_user, st)}
                            className={cn(
                                "cursor-pointer text-xs font-semibold py-2.5",
                                displayStatus === st ? "bg-primary text-primary-foreground font-bold" : ""
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
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};