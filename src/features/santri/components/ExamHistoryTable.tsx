import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  User,
  Calculator,
} from "lucide-react";
import { type ExamSession, ujianService } from "../../setoran/api/ujian-api";
import { type ProgresSantri } from "../types";
import { surahNumberToName } from "@/utils/mushafUtils";


interface ExamHistoryTableProps {
  santri: ProgresSantri;
}

export function ExamHistoryTable({ santri }: ExamHistoryTableProps) {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await ujianService.getExamHistory(santri.id_santri);
        if (res.success && res.data) {
          setSessions(res.data);
        } else {
          toast.error(res.message || "Gagal memuat riwayat ujian");
        }
      } catch (err: any) {
        console.error("Gagal memuat riwayat ujian:", err);
        toast.error(err.message || "Terjadi kesalahan koneksi");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [santri.id_santri]);

  // Hitung statistik
  const stats = useMemo(() => {
    const totalUjian = sessions.length;
    const scores = sessions
      .map((s) => s.nilai_akhir)
      .filter((n): n is number => n !== null);
    
    const averageScore =
      scores.length > 0
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        : "0.0";

    // Cari predikat paling sering muncul
    const predikatCounts: Record<string, number> = {};
    sessions.forEach((s) => {
      if (s.predikat) {
        predikatCounts[s.predikat] = (predikatCounts[s.predikat] || 0) + 1;
      }
    });

    let topPredikat = "—";
    let maxCount = 0;
    Object.keys(predikatCounts).forEach((p) => {
      if (predikatCounts[p] > maxCount) {
        maxCount = predikatCounts[p];
        topPredikat = p;
      }
    });

    return {
      totalUjian,
      averageScore,
      topPredikat,
    };
  }, [sessions]);

  const toggleRow = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const getPredikatBadgeVariant = (predikat: string | null) => {
    if (!predikat) return "outline";
    const p = predikat.toUpperCase();
    if (p.includes("MUMTAZ")) return "default"; // Green background
    if (p.includes("JAYYID JIDDAN")) return "secondary"; // Cloud-like/Secondary
    if (p.includes("JAYYID") || p.includes("MAQBUL")) return "outline"; // Outline
    return "destructive"; // Red background for Rasib
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span>Memuat riwayat ujian...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── STATS CARDS ROW ── */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Total Ujian
            </p>
            <h4 className="text-base font-bold mt-0.5">
              {stats.totalUjian} kali
            </h4>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Rata-rata Nilai
            </p>
            <h4 className="text-base font-bold mt-0.5 text-primary">
              {stats.averageScore}
            </h4>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Predikat Terbanyak
            </p>
            <h4 className="text-sm font-black mt-1 text-emerald-600 truncate">
              {stats.topPredikat}
            </h4>
          </CardContent>
        </Card>
      </div>

      {/* ── TABLE VIEW ── */}
      <div className="border rounded-xl overflow-hidden bg-card">
        {sessions.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8 text-muted-foreground/40" />
            <span>Belum ada riwayat ujian untuk santri ini.</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[120px] text-xs">Tanggal</TableHead>
                <TableHead className="text-xs">Ujian</TableHead>
                <TableHead className="w-[100px] text-xs text-center">Nilai</TableHead>
                <TableHead className="w-[150px] text-xs">Predikat</TableHead>
                <TableHead className="w-[130px] text-xs hidden md:table-cell">Penguji</TableHead>
                <TableHead className="w-[80px] text-right pr-4 text-xs">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => {
                const date = new Date(session.created_at);
                const dateLabel = format(date, "dd/MM/yyyy", {
                  locale: idLocale,
                });
                const isExpanded = expandedRow === session.id_sesi_ujian;

                return (
                  <>
                    <TableRow
                      key={session.id_sesi_ujian}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleRow(session.id_sesi_ujian)}
                    >
                      <TableCell className="py-3 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {dateLabel}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-xs font-bold text-foreground">
                          {session.template?.nama_ujian}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-3 text-sm font-extrabold text-primary">
                        {session.nilai_akhir ?? "—"}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant={getPredikatBadgeVariant(session.predikat)}>
                          {session.predikat || "DRAFT"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 shrink-0" />
                          {session.muhafiz?.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-4 py-3">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={6} className="p-4 border-t">
                          <div className="space-y-4 max-w-full overflow-hidden">
                            {/* Catatan Sesi */}
                            {session.catatan && (
                              <div className="bg-background p-3 rounded-lg border text-xs text-muted-foreground italic flex gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                <div>
                                  <span className="font-bold block not-italic text-foreground">
                                    Catatan Penguji:
                                  </span>
                                  {session.catatan}
                                </div>
                              </div>
                            )}

                            {/* Judul Butir Soal */}
                            <div className="space-y-2">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                <Calculator className="h-3.5 w-3.5 text-primary" />
                                Detail Jawaban & Kesalahan Per Soal
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {session.jawaban_soal.map((jawaban) => {
                                  const detail = jawaban.soal_detail;
                                  let materi = "Soal " + jawaban.nomor_soal;
                                  if (detail?.deskripsi_soal) {
                                    materi = detail.deskripsi_soal;
                                  } else if (detail?.start_surat_id) {
                                    const sName = surahNumberToName(detail.start_surat_id);
                                    materi = `Surah ${sName} Ayat ${detail.start_ayat ?? ""} - ${detail.end_ayat ?? ""}`;
                                  }

                                  return (
                                    <div
                                      key={jawaban.id_jawaban}
                                      className="bg-background rounded-lg border p-3.5 space-y-2.5 flex flex-col justify-between shadow-sm"
                                    >
                                      <div>
                                        <span className="font-black text-primary text-[10px] uppercase tracking-wider">
                                          Soal #{jawaban.nomor_soal}
                                        </span>
                                        <p className="text-xs font-bold text-foreground mt-0.5">
                                          {materi}
                                        </p>
                                      </div>

                                      {/* Tampilkan data input secara dinamis */}
                                      <div className="space-y-1 pt-1.5 border-t border-dashed">
                                        {Object.keys(jawaban.input_data).map((key) => {
                                          const labelObj = session.template?.input_schema?.find(
                                            (field) => field.key === key
                                          );
                                          const label = labelObj?.label || key;
                                          const val = jawaban.input_data[key];

                                          // Skip detail text jika panjang, tapi render jika pendek
                                          if (typeof val === "string" && val.length > 50) {
                                            return (
                                              <div key={key} className="text-[10px] text-muted-foreground mt-1">
                                                <span className="font-semibold block text-foreground">{label}:</span>
                                                <p className="italic leading-normal">{val}</p>
                                              </div>
                                            );
                                          }

                                          return (
                                            <div
                                              key={key}
                                              className="flex justify-between items-center text-[10px]"
                                            >
                                              <span className="text-muted-foreground truncate mr-2">
                                                {label}
                                              </span>
                                              <span className="font-bold text-foreground shrink-0">
                                                {val === "" ? "—" : val.toString()}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Info Formula */}
                            <div className="text-[9px] text-muted-foreground/60 text-right">
                              Rumus Evaluasi: <code>{session.template?.formula_expression}</code>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
