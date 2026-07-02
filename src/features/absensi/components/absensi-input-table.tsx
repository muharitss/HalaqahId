import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { absensiStatusSchema } from "../types/absensi.schema";
import { useAbsensi } from "./absensi-provider";

export function AbsensiInputTable() {
  const {
    santriList,
    loadingSantri,
    isLoadingSync,
    attendanceMap,
    submittedAttendance,
    handleStatusChange,
    handleSave,
    isSubmitting,
    selectedSesi,
    isDateValidForSesi,
    currentSesiObj,
  } = useAbsensi();

  if (isLoadingSync || loadingSantri) {
    return (
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (santriList.length === 0) {
    return (
      <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground opacity-20 mb-4" />
        <p className="text-muted-foreground font-medium">
          Tidak ada santri di halaqah ini.
        </p>
      </div>
    );
  }

  if (!isDateValidForSesi) {
    return (
      <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-amber-500 mb-4" />
        <p className="text-amber-600 font-medium text-lg">
          Sesi {currentSesiObj?.nama_sesi} tidak dijadwalkan pada hari ini.
        </p>
        <p className="text-sm text-amber-500 mt-2">
          Silakan pilih sesi yang sesuai atau ubah tanggal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
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
                <TableRow
                  key={s.id_santri}
                  className={cn(isSubmitted && !isEditing ? "bg-primary/[0.01]" : "")}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm md:text-base">
                        {s.nama_santri}
                      </span>

                      {isEditing && (
                        <Badge
                          variant="outline"
                          className="h-5 text-[9px] bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 font-bold uppercase"
                        >
                          Draft
                        </Badge>
                      )}
                      {isSubmitted && !isEditing && (
                        <Badge
                          variant="outline"
                          className="h-5 text-[9px] bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30 font-bold uppercase"
                        >
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
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 p-1.5">
                        {absensiStatusSchema.options.map((st) => (
                          <DropdownMenuItem
                            key={st}
                            onClick={() => handleStatusChange(s.id_santri, st)}
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
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
        <div className="flex items-start gap-2 text-muted-foreground italic text-xs max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Pilih status untuk mencatat atau mengubah kehadiran. Klik "Simpan" jika terdapat label "Draft" berwarna jingga.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={
            isSubmitting ||
            isLoadingSync ||
            loadingSantri ||
            santriList.length === 0 ||
            !selectedSesi ||
            !isDateValidForSesi ||
            Object.keys(attendanceMap).length === 0
          }
          className="w-full md:w-auto px-12 h-11 font-bold shadow-lg shadow-primary/20"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
        </Button>
      </div>
    </div>
  );
}
