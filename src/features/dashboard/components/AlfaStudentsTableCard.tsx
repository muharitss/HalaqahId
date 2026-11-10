import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, MoreVertical, ExternalLink, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AlfaStudent, ViewType } from "../types";

interface AlfaStudentsTableCardProps {
  alfaStudents: AlfaStudent[];
  loading: boolean;
  alfaView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function AlfaStudentsTableCard({
  alfaStudents,
  loading,
  alfaView,
  onViewChange,
}: AlfaStudentsTableCardProps) {
  const navigate = useNavigate();

  // Helper to estimate attendance percentage based on alfa count
  const calculateAttendanceScore = (alfaCount: number) => {
    // Estimasi sesi pekanan (6 hari) atau bulanan (24 hari)
    const totalSessions = alfaView === "pekan" ? 6 : 24;
    const score = Math.max(0, Math.round(((totalSessions - alfaCount) / totalSessions) * 100));
    return Math.min(score, 100);
  };

  return (
    <Card className="shadow-sm border border-border/70 bg-card rounded-xl overflow-hidden h-full flex flex-col justify-between">
      <div>
        <CardHeader className="p-4 pb-3 border-border/50">
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h6 className="text-base font-bold tracking-tight text-foreground">
                Santri Butuh Perhatian (Alfa)
              </h6>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-foreground">
                  {alfaStudents.length === 0 ? "0 santri alfa" : `${alfaStudents.length} santri`}
                </span>{" "}
                {alfaView === "pekan" ? "tercatat pekan ini" : "tercatat bulan ini"}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-muted/70 p-0.5 rounded-lg">
                <Button
                  variant={alfaView === "pekan" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange("pekan")}
                  className="text-[11px] h-7 px-2.5 font-medium shadow-none"
                >
                  Pekan
                </Button>
                <Button
                  variant={alfaView === "bulan" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange("bulan")}
                  className="text-[11px] h-7 px-2.5 font-medium shadow-none"
                >
                  Bulan
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs">
                  <DropdownMenuItem onClick={() => navigate("/kepala-muhafidz/absensi")}>
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    Buka Rekap Absensi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/kepala-muhafidz/izin")}>
                    <ShieldAlert className="mr-2 h-3.5 w-3.5" />
                    Kelola Izin Santri
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2.5 w-1/4" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          ) : alfaStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">Alhamdulillah, Kehadiran Penuh</p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
                Tidak ada santri dengan status Alfa pada periode {alfaView === "pekan" ? "pekan ini" : "bulan ini"}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <Table className="align-middle">
                <TableHeader className="bg-muted/40 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                  <TableRow>
                    <TableHead className="ps-4">Santri</TableHead>
                    <TableHead>Halaqah</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center min-w-[120px]">Kehadiran</TableHead>
                    <TableHead className="pe-4">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs divide-y divide-border/60">
                  {alfaStudents.map((student) => {
                    const score = calculateAttendanceScore(student.alfaCount);
                    return (
                      <TableRow key={student.id_santri} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="ps-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-full border">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                {student.nama_santri?.[0]?.toUpperCase() || "S"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{student.nama_santri}</p>
                              <p className="text-[10px] text-muted-foreground">ID: #{student.id_santri}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-3 text-muted-foreground">
                          {student.name_halaqah || "—"}
                        </TableCell>

                        <TableCell className="py-3 text-center">
                          <Badge variant="destructive" className="font-bold text-[10px] px-2 py-0.5 tracking-wide uppercase">
                            {student.alfaCount}x Alfa
                          </Badge>
                        </TableCell>

                        <TableCell className="py-3">
                          <div className="w-28 mx-auto space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                              <span>Skor</span>
                              <span className={score < 70 ? "text-destructive" : "text-foreground"}>
                                {score}%
                              </span>
                            </div>
                            <Progress
                              value={score}
                              className={`h-1.5 ${score < 70 ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="pe-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {student.dates.slice(0, 3).map((dateStr) => {
                              const d = new Date(dateStr);
                              const formatted = isNaN(d.getTime())
                                ? dateStr
                                : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                              return (
                                <Badge key={dateStr} variant="outline" className="text-[9px] px-1.5 py-0 bg-background font-normal">
                                  {formatted}
                                </Badge>
                              );
                            })}
                            {student.dates.length > 3 && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 bg-muted text-muted-foreground">
                                +{student.dates.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-3 px-4 border-t border-border/50 bg-muted/10 text-xs text-muted-foreground flex items-center justify-between">
        <span className="text-[11px]">
          Menampilkan catatan kehadiran santri berstatus Alfa
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={() => navigate("/kepala-muhafidz/absensi")}
          className="text-xs h-auto p-0 text-primary font-medium"
        >
          Lihat Semua Data
        </Button>
      </div>
    </Card>
  );
}
