"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  type AutoRangeResult,
  type ExamSchedule,
  type ExamTemplate,
  type SubmitExamResponse,
  ujianService,
} from "../api/ujian-api";
import { surahNumberToName } from "@/utils/mushafUtils";

const ALL_SURAHS = Array.from({ length: 114 }, (_, i) => {
  const num = i + 1;
  return { number: num, name: surahNumberToName(num) };
});

import { type Santri } from "@/features/santri/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Check,
  AlertCircle,
  Plus,
  Minus,
  Calculator,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RefreshCw,
  MapPin,
  Calendar,
  Clock,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Client-side math formula evaluator
function previewNilai(formulaExpression: string, context: Record<string, number>): number {
  let expr = formulaExpression;
  const keys = Object.keys(context).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const escaped = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    expr = expr.replace(new RegExp(`\\b${escaped}\\b`, "g"), context[key].toString());
  }
  try {
    const tokens = expr.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\(|\))/g) || [];
    const values: number[] = [];
    const ops: string[] = [];
    const prec = (op: string) => (op === "+" || op === "-" ? 1 : 2);
    const apply = (op: string, b: number, a: number) => {
      if (op === "+") return a + b;
      if (op === "-") return a - b;
      if (op === "*") return a * b;
      if (op === "/") return b === 0 ? 0 : a / b;
      return 0;
    };
    for (const t of tokens) {
      if (!isNaN(Number(t))) {
        values.push(Number(t));
      } else if (t === "(") {
        ops.push(t);
      } else if (t === ")") {
        while (ops.length && ops[ops.length - 1] !== "(") {
          const b = values.pop()!; const a = values.pop()!; const op = ops.pop()!;
          values.push(apply(op, b, a));
        }
        ops.pop();
      } else if (["+", "-", "*", "/"].includes(t)) {
        while (ops.length && prec(ops[ops.length - 1]) >= prec(t)) {
          const b = values.pop()!; const a = values.pop()!; const op = ops.pop()!;
          values.push(apply(op, b, a));
        }
        ops.push(t);
      }
    }
    while (ops.length) {
      const b = values.pop()!; const a = values.pop()!; const op = ops.pop()!;
      values.push(apply(op, b, a));
    }
    return Math.max(0, Math.min(100, Math.round((values[0] || 0) * 100) / 100));
  } catch {
    return 0;
  }
}

interface DynamicExamFormProps {
  santriList: Santri[];
  sesiList: Array<{ id_sesi: number; nama_sesi: string }>;
  onSuccess: () => void;
}

type ExamInputValue = string | number;

interface MultiSoalQuestion {
  nomor_soal: number;
  start_surat_id: number;
  start_ayat: number;
  end_surat_id: number;
  end_ayat: number;
  materi_soal: string;
  input_values: Record<string, ExamInputValue>;
}

interface HalaqahOption {
  id: number;
  name: string;
}

const getDefaultInputValue = (field: ExamTemplate["input_schema"][number]): ExamInputValue => {
  if (field.default !== undefined) return field.default;
  return field.type === "TEXTAREA" ? "" : 0;
};

const createInitialInputs = (template: ExamTemplate): Record<string, ExamInputValue> => {
  return template.input_schema.reduce<Record<string, ExamInputValue>>((acc, field) => {
    acc[field.key] = getDefaultInputValue(field);
    return acc;
  }, {});
};

const toTemplateFromSchedule = (schedule?: ExamSchedule): ExamTemplate | null => {
  if (!schedule?.template) return null;

  return {
    id_template: schedule.id_template,
    id_sekolah: schedule.id_sekolah,
    nama_template: schedule.template.nama_template,
    nama_ujian: schedule.template.nama_template,
    jenis_ujian: schedule.template.jenis_ujian,
    exam_mode: schedule.template.jenis_ujian,
    input_schema: schedule.template.input_schema || [],
    formula_expression: schedule.template.formula_expression || "",
    aturan_kelulusan: schedule.template.aturan_kelulusan,
    is_aktif: true,
  };
};

export function DynamicExamForm({ santriList, sesiList: _sesiList, onSuccess }: DynamicExamFormProps) {
  const [selectedHalaqahId, setSelectedHalaqahId] = useState<number | null>(null);
  const [selectedSantriId, setSelectedSantriId] = useState<number | null>(null);
  const [selectedJadwalId, setSelectedJadwalId] = useState<number | null>(null);
  const [singlePassInputs, setSinglePassInputs] = useState<Record<string, ExamInputValue>>({});
  const [multiSoalQuestions, setMultiSoalQuestions] = useState<MultiSoalQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [catatanUjian, setCatatanUjian] = useState("");
  const [result, setResult] = useState<SubmitExamResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const halaqahList = useMemo<HalaqahOption[]>(() => {
    const map = new Map<number, string>();

    santriList.forEach((santri) => {
      if (!santri.id_halaqah) return;
      map.set(
        santri.id_halaqah,
        santri.halaqah?.name_halaqah || `Halaqah ${santri.id_halaqah}`
      );
    });

    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name, "id")
    );
  }, [santriList]);

  useEffect(() => {
    if (selectedHalaqahId || halaqahList.length !== 1) return;
    setSelectedHalaqahId(halaqahList[0].id);
  }, [halaqahList, selectedHalaqahId]);

  const filteredSantriList = useMemo(() => {
    if (!selectedHalaqahId) return [];
    return santriList.filter((santri) => santri.id_halaqah === selectedHalaqahId);
  }, [santriList, selectedHalaqahId]);

  const { data: schedules = [], isLoading: loadingSchedules } = useQuery<ExamSchedule[]>({
    queryKey: ["exam-schedules-active"],
    queryFn: async () => {
      const res = await ujianService.getExamSchedules();
      return (res.data || []).filter((schedule) => schedule.status === "AKTIF");
    },
  });

  const selectedSchedule = useMemo(() => {
    return schedules.find((schedule) => schedule.id_jadwal === selectedJadwalId) || null;
  }, [schedules, selectedJadwalId]);

  const template = useMemo(() => toTemplateFromSchedule(selectedSchedule || undefined), [selectedSchedule]);

  useEffect(() => {
    if (!selectedJadwalId) return;
    if (!schedules.some((schedule) => schedule.id_jadwal === selectedJadwalId)) {
      setSelectedJadwalId(null);
    }
  }, [schedules, selectedJadwalId]);



  // ── 5. QUERY AUTORANGE / SNAPSHOT STATISTICS ──
  const shouldFetchRange = !!selectedSantriId && !!selectedJadwalId && !!selectedSchedule;
  const { data: rangeData, isLoading: rangeLoading, refetch: refetchRange } = useQuery<AutoRangeResult>({
    queryKey: ["auto-range-exam", selectedSantriId, selectedJadwalId],
    queryFn: async () => {
      if (!selectedSantriId || !selectedJadwalId || !selectedSchedule) return { found: false };
      const res = await ujianService.getAutoRange(selectedSantriId, selectedJadwalId, {
        periode_start: selectedSchedule.periode_start,
        periode_end: selectedSchedule.periode_end,
      });
      return res.data as AutoRangeResult;
    },
    enabled: shouldFetchRange,
  });

  // ── 6. INITIALIZE GRADING FORMS WHEN TEMPLATE CHANGES ──
  useEffect(() => {
    if (!template) return;

    if (template.jenis_ujian === "SINGLE_PASS") {
      setSinglePassInputs(createInitialInputs(template));
    } else {
      // MULTI_SOAL
      const numQuestions = template.jumlah_soal || 3; // Default 3 questions
      const initialQuestions = Array.from({ length: numQuestions }, (_, i) => {
        return {
          nomor_soal: i + 1,
          start_surat_id: template.soal_acak_tanpa_detail ? 0 : 1,
          start_ayat: template.soal_acak_tanpa_detail ? 0 : 1,
          end_surat_id: template.soal_acak_tanpa_detail ? 0 : 1,
          end_ayat: template.soal_acak_tanpa_detail ? 0 : 7,
          materi_soal: template.soal_acak_tanpa_detail 
            ? `Pertanyaan Acak #${i + 1}` 
            : "Al-Fatihah Ayat 1 - 7",
          input_values: createInitialInputs(template),
        };
      });
      setMultiSoalQuestions(initialQuestions);
      setActiveQuestionIndex(0);
    }
    setResult(null);
  }, [template]);

  // ── 7. GRADING INPUT CHANGE HANDLERS ──
  const handleSinglePassChange = (key: string, value: any) => {
    setSinglePassInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleSinglePassCounter = (key: string, delta: number, min = 0) => {
    const cur = Number(singlePassInputs[key]) || 0;
    handleSinglePassChange(key, Math.max(min, cur + delta));
  };

  const handleMultiSoalInputChange = (qIdx: number, key: string, value: any) => {
    setMultiSoalQuestions(prev => {
      const updated = [...prev];
      updated[qIdx] = {
        ...updated[qIdx],
        input_values: { ...updated[qIdx].input_values, [key]: value }
      };
      return updated;
    });
  };

  const handleMultiSoalCounter = (qIdx: number, key: string, delta: number, min = 0) => {
    const cur = Number(multiSoalQuestions[qIdx]?.input_values[key]) || 0;
    handleMultiSoalInputChange(qIdx, key, Math.max(min, cur + delta));
  };

  // ── 8. DYNAMIC REAL-TIME SCORE PREVIEW ──
  const previewScore = useMemo(() => {
    if (!template) return 0;

    const context: Record<string, number> = {};

    if (template.jenis_ujian === "SINGLE_PASS") {
      Object.keys(singlePassInputs).forEach(k => {
        if (typeof singlePassInputs[k] === "number") {
          context[k] = singlePassInputs[k];
        }
      });
    } else {
      // MULTI_SOAL
      const variableLists: Record<string, number[]> = {};
      multiSoalQuestions.forEach(q => {
        Object.keys(q.input_values).forEach(k => {
          const val = q.input_values[k];
          if (typeof val === "number") {
            if (!variableLists[k]) variableLists[k] = [];
            variableLists[k].push(val);
          }
        });
      });

      Object.keys(variableLists).forEach(k => {
        const list = variableLists[k];
        const total = list.reduce((a, b) => a + b, 0);
        context[`total_${k}`] = total;
        context[`avg_${k}`] = list.length > 0 ? total / list.length : 0;
        context[`max_${k}`] = Math.max(...list);
        context[`min_${k}`] = Math.min(...list);
      });
    }

    return previewNilai(template.formula_expression, context);
  }, [template, singlePassInputs, multiSoalQuestions]);

  // ── 9. SUBMIT RESULT ──
  const handleSubmit = async () => {
    if (!selectedJadwalId || !selectedSantriId) {
      toast.error("Silakan lengkapi pemilihan santri dan jadwal terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      let payload: any = {
        id_jadwal: selectedJadwalId,
        id_santri: selectedSantriId,
        catatan: catatanUjian || undefined,
        tipe_percobaan: "UTAMA",
      };

      if (template?.jenis_ujian === "SINGLE_PASS") {
        payload.input_data = singlePassInputs;
      } else {
        payload.input_data = {};
        payload.questions = multiSoalQuestions.map(q => ({
          nomor_soal: q.nomor_soal,
          deskripsi_soal: q.materi_soal,
          start_surat_id: template?.soal_acak_tanpa_detail ? undefined : q.start_surat_id,
          start_ayat: template?.soal_acak_tanpa_detail ? undefined : q.start_ayat,
          end_surat_id: template?.soal_acak_tanpa_detail ? undefined : q.end_surat_id,
          end_ayat: template?.soal_acak_tanpa_detail ? undefined : q.end_ayat,
          input_data: q.input_values,
        }));
      }

      const res = await ujianService.submitExam(payload);
      if (res.success && res.data) {
        setResult(res.data);
        toast.success("Ujian berhasil diselesaikan dan disimpan!");
      } else {
        toast.error(res.message || "Gagal menyimpan hasil ujian");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedSantriId(null);
    setSelectedJadwalId(null);
    setCatatanUjian("");
    onSuccess();
  };

  // ── 10. RENDER RESULTS VIEW ──
  if (result) {
    return (
      <Card className="border-2 border-emerald-500/20 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-emerald-500/5 p-8 text-center space-y-3 border-b">
          <GraduationCap className="h-16 w-16 mx-auto text-emerald-500 animate-bounce" />
          <CardTitle className="text-2xl font-black text-foreground">Hasil Evaluasi Ujian</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Ujian selesai dinilai secara otomatis oleh Grading Engine.
          </CardDescription>
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background rounded-xl p-5 border text-center space-y-1 shadow-sm">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Nilai Akhir</span>
              <p className="text-4xl font-extrabold text-primary">{result.nilai_akhir}</p>
            </div>
            <div className="bg-background rounded-xl p-5 border text-center space-y-1 shadow-sm">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Predikat</span>
              <p className="text-2xl font-black text-emerald-600">{result.predikat}</p>
            </div>
            <div className="bg-background rounded-xl p-5 border text-center space-y-1 shadow-sm">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Hasil Kelulusan</span>
              <p className={`text-2xl font-black ${result.is_lulus ? "text-green-600" : "text-destructive"}`}>
                {result.is_lulus ? "LULUS" : "TIDAK LULUS"}
              </p>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl p-5 space-y-2 border border-dashed text-xs">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> Hasil Penilaian Sistem
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Hasil Ujian atas nama santri terpilih telah disimpan dan diverifikasi. Laporan dan statistik perkembangan hafalan santri akan otomatis diperbarui mengacu pada data snapshot yang terkunci pada ujian ini.
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleReset} className="w-full h-11 font-bold">
              Kembali ke Menu Utama
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── ALUR SELEKSI: Halaqah -> Santri -> Jadwal ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-foreground">1. Pilih Halaqah</Label>
          <Select
            value={selectedHalaqahId?.toString()}
            onValueChange={(val) => {
              setSelectedHalaqahId(Number(val));
              setSelectedSantriId(null);
              setSelectedJadwalId(null);
            }}
          >
            <SelectTrigger className="h-10 text-xs">
              <SelectValue placeholder="Pilih Halaqah" />
            </SelectTrigger>
            <SelectContent>
              {halaqahList.map((h) => (
                <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-foreground">2. Pilih Santri</Label>
          <Select
            value={selectedSantriId?.toString()}
            onValueChange={(val) => {
              setSelectedSantriId(Number(val));
              setSelectedJadwalId(null);
            }}
            disabled={!selectedHalaqahId}
          >
            <SelectTrigger className="h-10 text-xs">
              <SelectValue placeholder={selectedHalaqahId ? "Pilih Santri" : "Pilih halaqah dahulu"} />
            </SelectTrigger>
            <SelectContent>
              {filteredSantriList.map((s) => (
                <SelectItem key={s.id_santri} value={s.id_santri.toString()}>{s.nama_santri}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-foreground">3. Pilih Jadwal Ujian</Label>
          <Select
            value={selectedJadwalId?.toString()}
            onValueChange={(val) => setSelectedJadwalId(Number(val))}
            disabled={!selectedSantriId || loadingSchedules}
          >
            <SelectTrigger className="h-10 text-xs">
              <SelectValue placeholder={selectedSantriId ? "Pilih Jadwal Ujian" : "Pilih santri dahulu"} />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((s) => (
                <SelectItem key={s.id_jadwal} value={s.id_jadwal.toString()}>{s.judul_jadwal}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── SCHEDULE DETAILS SUMMARY ── */}
      {selectedSchedule && (
        <Card className="bg-muted/15 border shadow-sm">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <h3 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" /> Detail Jadwal Ujian
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground font-semibold">Ujian:</span>
                <span className="col-span-2 font-bold text-foreground">{selectedSchedule.judul_jadwal}</span>
                <span className="text-muted-foreground font-semibold">Tanggal:</span>
                <span className="col-span-2 font-bold text-foreground">
                  {format(parseISO(selectedSchedule.tanggal_ujian), "d MMMM yyyy", { locale: idLocale })}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> Periode Setoran Diuji
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground font-semibold">Mulai:</span>
                <span className="col-span-2 font-bold text-foreground">
                  {format(parseISO(selectedSchedule.periode_start), "d MMMM yyyy", { locale: idLocale })}
                </span>
                <span className="text-muted-foreground font-semibold">Selesai:</span>
                <span className="col-span-2 font-bold text-foreground">
                  {format(parseISO(selectedSchedule.periode_end), "d MMMM yyyy", { locale: idLocale })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── AUTOCALCULATION RANGE DISPLAY ── */}
      {shouldFetchRange && (
        <div className={`rounded-xl border p-4 space-y-2.5 transition-all ${
          rangeData?.found ? "bg-emerald-500/5 border-emerald-200 dark:border-emerald-800" : "bg-muted/20 border-dashed"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Materi & Statistik Setoran Santri (Kalkulasi Otomatis / Snapshot)
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => refetchRange()}
              disabled={rangeLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${rangeLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {rangeLoading ? (
            <div className="text-xs text-muted-foreground animate-pulse">Menghitung materi setoran santri...</div>
          ) : rangeData?.found ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-7 space-y-1">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">Rentang Ayat Hafalan:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-extrabold text-foreground">
                    {rangeData.start_surat_id ? `${surahNumberToName(rangeData.start_surat_id)} Ayat ${rangeData.start_ayat}` : `Juz ${rangeData.start_juz}`}
                  </span>
                  <span className="text-muted-foreground font-black">→</span>
                  <span className="text-sm font-extrabold text-foreground">
                    {rangeData.end_surat_id ? `${surahNumberToName(rangeData.end_surat_id)} Ayat ${rangeData.end_ayat}` : `Juz ${rangeData.end_juz}`}
                  </span>
                </div>
              </div>
              <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-background border rounded-lg p-2 flex flex-col justify-center items-center shadow-xs">
                  <span className="text-muted-foreground font-semibold">Total</span>
                  <span className="text-xs font-black text-foreground">{rangeData.total_halaman} Hlm</span>
                </div>
                <div className="bg-background border rounded-lg p-2 flex flex-col justify-center items-center shadow-xs">
                  <span className="text-muted-foreground font-semibold">Setoran</span>
                  <span className="text-xs font-black text-foreground">{rangeData.count_setoran}x</span>
                </div>
                <div className="bg-background border rounded-lg p-2 flex flex-col justify-center items-center shadow-xs">
                  <span className="text-muted-foreground font-semibold">Keaktifan</span>
                  <span className="text-xs font-black text-foreground">{rangeData.jumlah_hari_setor} Hari</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic leading-relaxed">
              {rangeData?.message || "Tidak ada setoran ditemukan pada periode jadwal ini. Sistem akan menonaktifkan kalkulasi otomatis untuk santri ini."}
            </div>
          )}
        </div>
      )}

      {/* ── EXAM GRADING FORM AREA ── */}
      {template && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {template.jenis_ujian === "SINGLE_PASS" ? (
            /* ── SINGLE_PASS UI ── */
            <Card className="border border-primary/10 shadow-sm overflow-hidden">
              <div className="bg-primary/5 px-6 py-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-black text-primary text-sm tracking-wider uppercase">Penilaian Single Pass</span>
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase">
                  KKM: {template.aturan_kelulusan?.kkm || 70}
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-6">
                  {template.input_schema.filter(f => f.type === "COUNTER").map((field) => {
                    const value = singlePassInputs[field.key] || 0;
                    return (
                      <div key={field.key} className="flex flex-col items-center gap-4">
                        <Label className="text-xs font-extrabold uppercase text-muted-foreground tracking-widest">{field.label}</Label>
                        <div className="flex items-center gap-6">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-2xl text-lg shadow-sm border-2 hover:bg-destructive/5 hover:border-destructive"
                            onClick={() => handleSinglePassCounter(field.key, -1, field.min)}
                            disabled={value === 0}
                          >
                            <Minus className="h-5 w-5" />
                          </Button>

                          <div className="flex flex-col items-center">
                            <Input
                              type="number"
                              min={0}
                              value={value}
                              onChange={(e) => handleSinglePassChange(field.key, Math.max(0, Number(e.target.value) || 0))}
                              className="text-4xl font-black text-center h-20 w-32 border-2 rounded-2xl bg-background focus:border-primary"
                            />
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-2xl text-lg shadow-sm border-2 hover:bg-primary/5 hover:border-primary"
                            onClick={() => handleSinglePassCounter(field.key, 1, field.min)}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Render non-counter fields if any */}
                  {template.input_schema.filter(f => f.type !== "COUNTER" && f.type !== "TEXTAREA").map((field) => {
                    const value = singlePassInputs[field.key] || 0;
                    return (
                      <div key={field.key} className="w-full max-w-sm space-y-1 bg-muted/10 p-3 rounded-lg border">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">{field.label}</Label>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => handleSinglePassChange(field.key, Number(e.target.value) || 0)}
                          className="h-9 font-bold bg-background text-center mt-1"
                        />
                      </div>
                    );
                  })}

                  {/* Live preview score bar */}
                  <div className="w-full max-w-sm border-t pt-4 border-dashed mt-2">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1">
                        <Award className="h-4.5 w-4.5 text-primary" /> Perkiraan Nilai:
                      </span>
                      <code className="text-primary font-mono font-bold text-sm bg-primary/5 border px-2 py-0.5 rounded">
                        {previewScore}
                      </code>
                    </div>
                    <div className="bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          previewScore >= 90 ? "bg-emerald-500" :
                          previewScore >= (template.aturan_kelulusan?.kkm || 70) ? "bg-primary" :
                          previewScore >= 60 ? "bg-amber-500" : "bg-destructive"
                        }`}
                        style={{ width: `${previewScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-muted-foreground mt-1.5 font-bold uppercase tracking-wider">
                      <span>0 (Rasib)</span>
                      <span className={previewScore >= (template.aturan_kelulusan?.kkm || 70) ? "text-primary font-extrabold" : "text-destructive font-extrabold"}>
                        {previewScore >= (template.aturan_kelulusan?.kkm || 70) ? "LULUS" : "TIDAK LULUS"}
                      </span>
                      <span>100 (Mumtaz)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* ── MULTI_SOAL UI ── */
            <div className="space-y-4">
              <Card className="border border-primary/10 shadow-sm relative overflow-hidden bg-card">
                <div className="bg-primary/5 px-6 py-3.5 flex justify-between items-center border-b">
                  <span className="font-black text-primary text-xs tracking-wider uppercase">
                    Soal Uji Ke-{activeQuestionIndex + 1} dari {multiSoalQuestions.length}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs font-semibold"
                      onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={activeQuestionIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1 inline" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2.5 text-xs font-semibold"
                      onClick={() => setActiveQuestionIndex(prev => Math.min(multiSoalQuestions.length - 1, prev + 1))}
                      disabled={activeQuestionIndex === multiSoalQuestions.length - 1}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1 inline" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-5 space-y-5">
                  {!template.soal_acak_tanpa_detail ? (
                    <div className="space-y-3 bg-muted/10 p-4 rounded-xl border border-dashed">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary">
                        Materi Uji Al-Quran (Ruang Lingkup Soal #{activeQuestionIndex + 1})
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold text-muted-foreground">Pilih Surah</Label>
                          <Select
                            value={multiSoalQuestions[activeQuestionIndex]?.start_surat_id?.toString() || "1"}
                            onValueChange={(val) => {
                              const surahNum = Number(val);
                              const surahName = surahNumberToName(surahNum);
                              setMultiSoalQuestions(prev => {
                                const updated = [...prev];
                                const startAyat = updated[activeQuestionIndex].start_ayat || 1;
                                const endAyat = updated[activeQuestionIndex].end_ayat || 10;
                                updated[activeQuestionIndex] = {
                                  ...updated[activeQuestionIndex],
                                  start_surat_id: surahNum,
                                  end_surat_id: surahNum,
                                  materi_soal: `${surahName} Ayat ${startAyat} - ${endAyat}`,
                                };
                                return updated;
                              });
                            }}
                          >
                            <SelectTrigger className="bg-background h-9 text-xs"><SelectValue placeholder="Pilih Surah" /></SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {ALL_SURAHS.map((s) => (
                                <SelectItem key={s.number} value={s.number.toString()}>{s.number}. {s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold text-muted-foreground">Ayat Mulai</Label>
                          <Input
                            type="number"
                            min={1}
                            value={multiSoalQuestions[activeQuestionIndex]?.start_ayat ?? 1}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 1;
                              const surahName = surahNumberToName(multiSoalQuestions[activeQuestionIndex]?.start_surat_id || 1);
                              setMultiSoalQuestions(prev => {
                                const updated = [...prev];
                                const endAyat = updated[activeQuestionIndex].end_ayat || 10;
                                updated[activeQuestionIndex] = {
                                  ...updated[activeQuestionIndex],
                                  start_ayat: val,
                                  materi_soal: `${surahName} Ayat ${val} - ${endAyat}`,
                                };
                                return updated;
                              });
                            }}
                            className="bg-background font-bold text-center h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold text-muted-foreground">Ayat Selesai</Label>
                          <Input
                            type="number"
                            min={1}
                            value={multiSoalQuestions[activeQuestionIndex]?.end_ayat ?? 10}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 1;
                              const surahName = surahNumberToName(multiSoalQuestions[activeQuestionIndex]?.start_surat_id || 1);
                              setMultiSoalQuestions(prev => {
                                const updated = [...prev];
                                const startAyat = updated[activeQuestionIndex].start_ayat || 1;
                                updated[activeQuestionIndex] = {
                                  ...updated[activeQuestionIndex],
                                  end_ayat: val,
                                  materi_soal: `${surahName} Ayat ${startAyat} - ${val}`,
                                };
                                return updated;
                              });
                            }}
                            className="bg-background font-bold text-center h-9 text-xs"
                          />
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 pt-1.5 border-t border-dashed">
                        <span>Hasil materi otomatis:</span>
                        <code className="bg-background border px-2 py-0.5 rounded font-mono text-primary font-bold">
                          {multiSoalQuestions[activeQuestionIndex]?.materi_soal}
                        </code>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-3 text-xs">
                      <AlertCircle className="h-5 w-5 text-primary shrink-0 animate-pulse" />
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-foreground block">Ujian Soal Acak (Ujian Bulanan)</span>
                        <span className="text-muted-foreground">Muhafiz menanyakan soal secara acak. Tidak perlu mencatat detail surat/ayat di sistem, cukup input hasil penilaian kesalahan di bawah ini.</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {template.input_schema.map((field: any) => {
                      const value = multiSoalQuestions[activeQuestionIndex]?.input_values[field.key];
                      if (field.type === "COUNTER") {
                        return (
                          <div key={field.key} className="space-y-2 bg-muted/20 p-4 rounded-xl border flex flex-col justify-between">
                            <Label className="font-bold text-xs text-muted-foreground uppercase tracking-wide">{field.label}</Label>
                            <div className="flex items-center justify-between mt-2">
                              <Button variant="outline" size="icon" type="button" className="h-9 w-9 rounded-lg shadow-sm" onClick={() => handleMultiSoalCounter(activeQuestionIndex, field.key, -1, field.min)}>
                                <Minus className="h-4.5 w-4.5" />
                              </Button>
                              <span className="text-xl font-black text-foreground w-10 text-center">{value ?? 0}</span>
                              <Button variant="outline" size="icon" type="button" className="h-9 w-9 rounded-lg shadow-sm" onClick={() => handleMultiSoalCounter(activeQuestionIndex, field.key, 1, field.min)}>
                                <Plus className="h-4.5 w-4.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      }
                      if (field.type === "NUMBER") {
                        return (
                          <div key={field.key} className="space-y-2 bg-muted/20 p-4 rounded-xl border flex flex-col justify-between">
                            <Label className="font-bold text-xs text-muted-foreground uppercase tracking-wide" htmlFor={`field-${field.key}`}>{field.label}</Label>
                            <Input id={`field-${field.key}`} type="number" min={field.min ?? 0} max={field.max ?? 100} value={value ?? 0} onChange={(e) => handleMultiSoalInputChange(activeQuestionIndex, field.key, Number(e.target.value))} className="h-9 text-xs font-bold text-center bg-background" />
                          </div>
                        );
                      }
                      if (field.type === "TEXTAREA") {
                        return (
                          <div key={field.key} className="col-span-1 md:col-span-2 space-y-1">
                            <Label className="font-bold text-xs text-foreground">{field.label}</Label>
                            <Textarea placeholder={`Masukkan ${field.label.toLowerCase()}...`} value={value ?? ""} onChange={(e) => handleMultiSoalInputChange(activeQuestionIndex, field.key, e.target.value)} rows={2} className="text-xs resize-none" />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Soal Keypad Selector */}
              <div className="flex flex-wrap gap-2 justify-center py-2">
                {multiSoalQuestions.map((_, index) => (
                  <Button
                    key={index}
                    variant={activeQuestionIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveQuestionIndex(index)}
                    className="w-9 h-9 font-bold rounded-lg shadow-sm text-xs"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              {/* Live Preview Score for Multi Soal */}
              <div className="bg-muted/15 border rounded-xl p-4 flex flex-col items-center gap-3 w-full">
                <div className="flex items-center justify-between text-xs w-full max-w-sm">
                  <span className="text-muted-foreground font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Award className="h-4.5 w-4.5 text-primary" /> Nilai Akhir (Akumulasi):
                  </span>
                  <code className="text-primary font-mono font-bold text-sm bg-primary/5 border px-2 py-0.5 rounded">
                    {previewScore}
                  </code>
                </div>
                <div className="bg-muted rounded-full h-2.5 overflow-hidden w-full max-w-sm">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      previewScore >= 90 ? "bg-emerald-500" :
                      previewScore >= (template.aturan_kelulusan?.kkm || 70) ? "bg-primary" :
                      previewScore >= 60 ? "bg-amber-500" : "bg-destructive"
                    }`}
                    style={{ width: `${previewScore}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Catatan Kesimpulan Penguji */}
          <div className="space-y-1.5 border-t pt-4">
            <Label htmlFor="exam-notes" className="font-bold text-xs text-foreground">
              Catatan Penguji / Kesimpulan Hasil Evaluasi
            </Label>
            <Textarea
              id="exam-notes"
              placeholder="Tulis catatan penutup atau saran bagi hafalan santri..."
              value={catatanUjian}
              onChange={(e) => setCatatanUjian(e.target.value)}
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
            <div className="flex items-start gap-2 text-muted-foreground italic text-[10px] max-w-md">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
              <p className="leading-relaxed">
                Menyimpan hasil ujian akan mengunci nilai dan menduplikasi data setoran menjadi snapshot materi secara permanen. Rumus: <code>{template.formula_expression}</code>.
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedSantriId}
              className="w-full md:w-auto px-12 h-11 font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-xs"
            >
              <Calculator className="h-4 w-4" />
              {loading ? "Menghitung & Menyimpan..." : "Selesaikan & Hitung Nilai"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
