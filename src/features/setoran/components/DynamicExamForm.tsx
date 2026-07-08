"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type ExamTemplate, type AutoRangeResult, ujianService } from "../api/ujian-api";
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
  Check, AlertCircle, Plus, Minus, Calculator, GraduationCap,
  ChevronLeft, ChevronRight, BookOpen, RefreshCw, MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface DynamicExamFormProps {
  template: ExamTemplate;
  santriList: Santri[];
  sesiList: Array<{ id_sesi: number; nama_sesi: string }>;
  onSuccess: () => void;
}

// ─────────────────────────────────────────────────────────────────────
// Preview nilai real-time
// ─────────────────────────────────────────────────────────────────────
function previewNilai(formulaExpression: string, context: Record<string, number>): number {
  let expr = formulaExpression;
  const keys = Object.keys(context).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const escaped = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    expr = expr.replace(new RegExp(`\\b${escaped}\\b`, "g"), context[key].toString());
  }
  try {
    // Safely evaluate expression with basic arithmetic
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

// ─────────────────────────────────────────────────────────────────────
// SINGLE PASS FORM — Ujian Bulanan
// ─────────────────────────────────────────────────────────────────────
interface SinglePassFormProps {
  template: ExamTemplate;
  santriList: Santri[];
  onSuccess: () => void;
}

function SinglePassForm({ template, santriList, onSuccess }: SinglePassFormProps) {
  const [selectedSantri, setSelectedSantri] = useState<number | null>(null);
  const [jumlahKesalahan, setJumlahKesalahan] = useState(0);
  const [catatanUjian, setCatatanUjian] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Periode bulan: default bulan ini
  const now = new Date();
  const [periodeLabel, setPeriodeLabel] = useState("bulan-ini");
  const periodeOptions = [
    { label: "Bulan Ini", value: "bulan-ini" },
    { label: "Bulan Lalu", value: "bulan-lalu" },
    { label: "2 Bulan Lalu", value: "2-bulan-lalu" },
  ];

  const periodeRange = useMemo(() => {
    if (periodeLabel === "bulan-lalu") {
      const d = subMonths(now, 1);
      return { start: startOfMonth(d), end: endOfMonth(d) };
    } else if (periodeLabel === "2-bulan-lalu") {
      const d = subMonths(now, 2);
      return { start: startOfMonth(d), end: endOfMonth(d) };
    }
    return { start: startOfMonth(now), end: endOfMonth(now) };
  }, [periodeLabel]);

  const periodeStartStr = periodeRange.start.toISOString();
  const periodeEndStr = periodeRange.end.toISOString();

  // Auto fetch range dari setoran
  const { data: rangeData, isLoading: rangeLoading, refetch: refetchRange } = useQuery<AutoRangeResult>({
    queryKey: ["auto-range", selectedSantri, periodeStartStr],
    queryFn: async () => {
      if (!selectedSantri) return { found: false, count_setoran: 0 };
      const res = await ujianService.getAutoRange(selectedSantri, {
        periode_start: periodeStartStr,
        periode_end: periodeEndStr,
      });
      return res.data as AutoRangeResult;
    },
    enabled: !!selectedSantri,
  });

  // Preview nilai
  const nilaiPerKesalahan = template.soal_rules?.nilai_per_kesalahan || 2;
  const previewContext = {
    total_jumlah_kesalahan: jumlahKesalahan,
    nilai_per_kesalahan: nilaiPerKesalahan,
  };
  const previewNilaiValue = previewNilai(template.formula_expression, previewContext);

  const handleCounterChange = (delta: number) => {
    setJumlahKesalahan((prev) => Math.max(0, prev + delta));
  };

  const handleSubmit = async () => {
    if (!selectedSantri) {
      toast.error("Silakan pilih santri terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id_template: template.id_template,
        id_santri: selectedSantri,
        catatan: catatanUjian || undefined,
        single_pass_data: {
          jumlah_kesalahan: jumlahKesalahan,
          periode_start: periodeStartStr,
          periode_end: periodeEndStr,
          start_surat_id: rangeData?.start_surat_id,
          start_ayat: rangeData?.start_ayat,
          end_surat_id: rangeData?.end_surat_id,
          end_ayat: rangeData?.end_ayat,
          start_surat: rangeData?.start_surat,
          end_surat: rangeData?.end_surat,
        },
      };

      const res = await ujianService.submitExam(payload);
      if (res.success) {
        setResult(res.data);
        toast.success("Ujian berhasil diselesaikan!");
      } else {
        toast.error(res.message || "Gagal menyimpan ujian");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSantri(null);
    setJumlahKesalahan(0);
    setCatatanUjian("");
    setResult(null);
    onSuccess();
  };

  if (result) {
    return (
      <Card className="border-2 border-emerald-500/20 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-emerald-500/5 p-8 text-center space-y-3 border-b">
          <GraduationCap className="h-16 w-16 mx-auto text-emerald-500 animate-bounce" />
          <CardTitle className="text-2xl font-black text-foreground">Hasil Evaluasi Ujian</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Ujian "{template.nama_ujian}" telah selesai dinilai secara otomatis oleh Grading Engine.
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
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Jumlah Kesalahan</span>
              <p className="text-4xl font-extrabold text-destructive">{jumlahKesalahan}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={resetForm} className="w-full h-11 font-bold">
              Kembali ke Input Setoran
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Pilih Santri + Periode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sp-santri" className="font-bold text-foreground">Santri yang Diuji</Label>
          <Select onValueChange={(v) => setSelectedSantri(Number(v))} value={selectedSantri?.toString()}>
            <SelectTrigger id="sp-santri" className="h-11">
              <SelectValue placeholder="Pilih Santri" />
            </SelectTrigger>
            <SelectContent>
              {santriList.map((s) => (
                <SelectItem key={s.id_santri} value={s.id_santri.toString()}>
                  {s.nama_santri}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sp-periode" className="font-bold text-foreground">Periode Ujian</Label>
          <Select onValueChange={setPeriodeLabel} value={periodeLabel}>
            <SelectTrigger id="sp-periode" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            {format(periodeRange.start, "d MMM yyyy", { locale: idLocale })} —{" "}
            {format(periodeRange.end, "d MMM yyyy", { locale: idLocale })}
          </p>
        </div>
      </div>

      {/* Auto Range Display */}
      {selectedSantri && (
        <div className={`rounded-xl border p-4 space-y-2 transition-all ${
          rangeData?.found ? "bg-emerald-500/5 border-emerald-200 dark:border-emerald-800" : "bg-muted/20 border-dashed"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Materi Ujian (dari akumulasi setoran)
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
            <div className="text-xs text-muted-foreground animate-pulse">Menghitung range setoran...</div>
          ) : rangeData?.found ? (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-foreground">
                  {rangeData.start_surat} {rangeData.start_ayat}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm font-black text-foreground">
                  {rangeData.end_surat} {rangeData.end_ayat}
                </span>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {rangeData.count_setoran} sesi setoran dalam periode ini
              </Badge>
            </>
          ) : (
            <div className="text-xs text-muted-foreground italic">
              {rangeData?.message || "Tidak ada setoran ditemukan pada periode ini"}
            </div>
          )}
        </div>
      )}

      {/* LARGE COUNTER — Jumlah Kesalahan */}
      <Card className="border border-primary/10 shadow-sm overflow-hidden">
        <div className="bg-primary/5 px-6 py-3 border-b flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-black text-primary text-sm tracking-wider uppercase">Jumlah Kesalahan</span>
        </div>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-8">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-2xl text-xl shadow-sm border-2 hover:bg-destructive/5 hover:border-destructive"
                onClick={() => handleCounterChange(-1)}
                disabled={jumlahKesalahan === 0}
              >
                <Minus className="h-6 w-6" />
              </Button>

              <div className="flex flex-col items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  value={jumlahKesalahan}
                  onChange={(e) => setJumlahKesalahan(Math.max(0, Number(e.target.value) || 0))}
                  className="text-5xl font-black text-center h-24 w-36 border-2 rounded-2xl bg-background focus:border-primary"
                  style={{ fontSize: "2.5rem" }}
                />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">kesalahan</span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-2xl text-xl shadow-sm border-2 hover:bg-primary/5 hover:border-primary"
                onClick={() => handleCounterChange(1)}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>

            {/* Preview Nilai Real-time */}
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground font-semibold">
                  Perkiraan Nilai:
                </span>
                <code className="text-muted-foreground font-mono">
                  100 − {jumlahKesalahan} × {nilaiPerKesalahan} = {previewNilaiValue}
                </code>
              </div>
              <div className="bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    previewNilaiValue >= 90 ? "bg-emerald-500" :
                    previewNilaiValue >= 70 ? "bg-primary" :
                    previewNilaiValue >= 60 ? "bg-amber-500" : "bg-destructive"
                  }`}
                  style={{ width: `${previewNilaiValue}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0</span>
                <span className="font-black text-lg text-foreground">{previewNilaiValue}</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catatan Ujian */}
      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="sp-notes" className="font-bold text-sm text-foreground">
          Catatan Penguji (opsional)
        </Label>
        <Textarea
          id="sp-notes"
          placeholder="Tulis catatan atau komentar untuk santri..."
          value={catatanUjian}
          onChange={(e) => setCatatanUjian(e.target.value)}
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-4">
        <div className="flex items-start gap-2 text-muted-foreground italic text-xs max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Rumus: <code>{template.formula_expression}</code> — Pengurangan {nilaiPerKesalahan} poin per kesalahan.
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading || !selectedSantri}
          className="w-full md:w-auto px-12 h-11 font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Calculator className="h-4 w-4" />
          {loading ? "Menghitung & Menyimpan..." : "Selesaikan & Hitung Nilai"}
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MAIN EXPORT — Router berdasarkan exam_mode
// ─────────────────────────────────────────────────────────────────────
export function DynamicExamForm({ template, santriList, sesiList, onSuccess }: DynamicExamFormProps) {
  // Route ke form yang sesuai berdasarkan exam_mode
  if (template.exam_mode === "SINGLE_PASS") {
    return (
      <SinglePassForm
        template={template}
        santriList={santriList}
        onSuccess={onSuccess}
      />
    );
  }

  // ── MULTI_SOAL (Default / Ujian Pekanan) ──
  return (
    <MultiSoalForm
      template={template}
      santriList={santriList}
      sesiList={sesiList}
      onSuccess={onSuccess}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────
// MULTI SOAL FORM — Ujian Pekanan (original form, refactored)
// ─────────────────────────────────────────────────────────────────────
function MultiSoalForm({ template, santriList, sesiList, onSuccess }: DynamicExamFormProps) {
  const [selectedSantri, setSelectedSantri] = useState<number | null>(null);
  const [selectedSesi, setSelectedSesi] = useState<number | null>(null);
  const [catatanUjian, setCatatanUjian] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const numQuestions = template.soal_rules?.jumlah_soal || 3;

  const [questionsData, setQuestionsData] = useState<Array<{
    nomor_soal: number;
    materi_soal: string;
    start_surat_id?: number;
    start_ayat?: number;
    end_surat_id?: number;
    end_ayat?: number;
    input_values: Record<string, any>;
  }>>([]);

  useEffect(() => {
    const initialQuestions = Array.from({ length: numQuestions }, (_, i) => {
      const initialInputs: Record<string, any> = {};
      template.input_schema.forEach((field) => {
        initialInputs[field.key] = field.default !== undefined ? field.default : (field.type === "COUNTER" || field.type === "NUMBER" || field.type === "SLIDER" ? 0 : "");
      });
      const isQuranMode = template.soal_rules?.mode === "QURAN_RANGE";
      return {
        nomor_soal: i + 1,
        materi_soal: isQuranMode ? "Al-Fatihah Ayat 1 - 7" : "",
        start_surat_id: isQuranMode ? 1 : undefined,
        start_ayat: isQuranMode ? 1 : undefined,
        end_surat_id: isQuranMode ? 1 : undefined,
        end_ayat: isQuranMode ? 7 : undefined,
        input_values: initialInputs,
      };
    });
    setQuestionsData(initialQuestions);
    setActiveQuestionIndex(0);
    setResult(null);
  }, [template, numQuestions]);

  const handleInputChange = (questionIndex: number, key: string, value: any) => {
    setQuestionsData((prev) => {
      const updated = [...prev];
      updated[questionIndex] = { ...updated[questionIndex], input_values: { ...updated[questionIndex].input_values, [key]: value } };
      return updated;
    });
  };

  const handleCounterChange = (questionIndex: number, key: string, delta: number, min = 0) => {
    const currentVal = questionsData[questionIndex]?.input_values[key] || 0;
    const newVal = Math.max(min, currentVal + delta);
    handleInputChange(questionIndex, key, newVal);
  };

  const handleSubmit = async () => {
    if (!selectedSantri) {
      toast.error("Silakan pilih santri terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        id_template: template.id_template,
        id_santri: selectedSantri,
        catatan: catatanUjian,
        questions: questionsData.map((q) => ({
          nomor_soal: q.nomor_soal,
          deskripsi_soal: q.materi_soal,
          start_surat_id: q.start_surat_id,
          start_ayat: q.start_ayat,
          end_surat_id: q.end_surat_id,
          end_ayat: q.end_ayat,
          input_data: q.input_values,
        })),
      };
      const res = await ujianService.submitExam(payload);
      if (res.success) {
        setResult(res.data);
        toast.success("Ujian berhasil diselesaikan!");
      } else {
        toast.error(res.message || "Gagal menyimpan ujian");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSantri(null);
    setSelectedSesi(null);
    setCatatanUjian("");
    setResult(null);
    onSuccess();
  };

  if (result) {
    return (
      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-primary/5 p-8 text-center space-y-3 border-b">
          <GraduationCap className="h-16 w-16 mx-auto text-primary animate-bounce" />
          <CardTitle className="text-2xl font-black text-foreground">Hasil Evaluasi Ujian</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Ujian "{template.nama_ujian}" telah selesai dinilai secara otomatis oleh Grading Engine.
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
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Kesalahan</span>
              <p className="text-4xl font-extrabold text-destructive">{result.total_kesalahan}</p>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl p-5 space-y-2 border border-dashed">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> Hasil Penilaian Sistem
            </h4>
            <p className="text-sm text-muted-foreground">
              Santri mendapatkan nilai akhir <strong>{result.nilai_akhir}</strong> dengan predikat{" "}
              <strong>{result.predikat}</strong>. Sesi ujian tercatat di database dengan ID Sesi #{result.session?.id_sesi_ujian}.
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={resetForm} className="w-full h-11 font-bold">
              Kembali ke Input Setoran
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeQuestion = questionsData[activeQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="exam-santri" className="font-bold text-foreground">Santri yang Diuji</Label>
          <Select onValueChange={(v) => setSelectedSantri(Number(v))} value={selectedSantri?.toString()}>
            <SelectTrigger id="exam-santri" className="h-11">
              <SelectValue placeholder="Pilih Santri" />
            </SelectTrigger>
            <SelectContent>
              {santriList.map((s) => (
                <SelectItem key={s.id_santri} value={s.id_santri.toString()}>
                  {s.nama_santri}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exam-sesi" className="font-bold text-foreground">Sesi Halaqah</Label>
          <Select onValueChange={(v) => setSelectedSesi(Number(v))} value={selectedSesi?.toString()}>
            <SelectTrigger id="exam-sesi" className="h-11">
              <SelectValue placeholder="Pilih Sesi" />
            </SelectTrigger>
            <SelectContent>
              {sesiList.map((s) => (
                <SelectItem key={s.id_sesi} value={s.id_sesi.toString()}>
                  {s.nama_sesi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeQuestion && (
        <Card className="border border-primary/10 shadow-sm relative overflow-hidden bg-card">
          <div className="bg-primary/5 px-6 py-4 flex justify-between items-center border-b">
            <span className="font-black text-primary text-sm tracking-wider uppercase">
              Pertanyaan {activeQuestionIndex + 1} dari {numQuestions}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))} disabled={activeQuestionIndex === 0}>
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setActiveQuestionIndex(prev => Math.min(numQuestions - 1, prev + 1))} disabled={activeQuestionIndex === numQuestions - 1}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            {template.soal_rules?.mode === "QURAN_RANGE" ? (
              <div className="space-y-4 bg-muted/10 p-4 rounded-xl border border-dashed animate-in fade-in duration-300">
                <Label className="text-xs font-black uppercase tracking-wider text-primary">
                  Materi Uji Al-Quran (Ruang Lingkup Soal)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground">Pilih Surah</Label>
                    <Select
                      value={activeQuestion.start_surat_id?.toString() || "1"}
                      onValueChange={(val) => {
                        const surahNum = Number(val);
                        const surahName = surahNumberToName(surahNum);
                        setQuestionsData((prev) => {
                          const updated = [...prev];
                          const startAyat = updated[activeQuestionIndex].start_ayat || 1;
                          const endAyat = updated[activeQuestionIndex].end_ayat || 10;
                          updated[activeQuestionIndex] = { ...updated[activeQuestionIndex], start_surat_id: surahNum, end_surat_id: surahNum, materi_soal: `${surahName} Ayat ${startAyat} - ${endAyat}` };
                          return updated;
                        });
                      }}
                    >
                      <SelectTrigger className="bg-background"><SelectValue placeholder="Pilih Surah" /></SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {ALL_SURAHS.map((s) => (
                          <SelectItem key={s.number} value={s.number.toString()}>{s.number}. {s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground">Ayat Mulai</Label>
                    <Input type="number" min={1} value={activeQuestion.start_ayat ?? 1}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 1;
                        const surahName = surahNumberToName(activeQuestion.start_surat_id || 1);
                        setQuestionsData((prev) => {
                          const updated = [...prev];
                          const endAyat = updated[activeQuestionIndex].end_ayat || 10;
                          updated[activeQuestionIndex] = { ...updated[activeQuestionIndex], start_ayat: val, materi_soal: `${surahName} Ayat ${val} - ${endAyat}` };
                          return updated;
                        });
                      }}
                      className="bg-background font-bold text-center h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground">Ayat Selesai</Label>
                    <Input type="number" min={1} value={activeQuestion.end_ayat ?? 10}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 1;
                        const surahName = surahNumberToName(activeQuestion.start_surat_id || 1);
                        setQuestionsData((prev) => {
                          const updated = [...prev];
                          const startAyat = updated[activeQuestionIndex].start_ayat || 1;
                          updated[activeQuestionIndex] = { ...updated[activeQuestionIndex], end_ayat: val, materi_soal: `${surahName} Ayat ${startAyat} - ${val}` };
                          return updated;
                        });
                      }}
                      className="bg-background font-bold text-center h-10"
                    />
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 pt-1.5 border-t border-dashed">
                  <span>Hasil deskripsi otomatis:</span>
                  <code className="bg-background border px-2 py-0.5 rounded font-mono text-primary font-bold">{activeQuestion.materi_soal}</code>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="font-bold text-sm text-foreground">Materi Uji (Surah / Ayat)</Label>
                <Input
                  placeholder="Contoh: Surat Al-Baqarah ayat 1-10 atau Soal Sambung Ayat"
                  value={activeQuestion.materi_soal}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuestionsData(prev => { const updated = [...prev]; updated[activeQuestionIndex].materi_soal = val; return updated; });
                  }}
                  className="h-11"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {template.input_schema.map((field) => {
                const value = activeQuestion.input_values[field.key];
                if (field.type === "COUNTER") {
                  return (
                    <div key={field.key} className="space-y-2 bg-muted/20 p-4 rounded-xl border flex flex-col justify-between">
                      <Label className="font-bold text-xs text-muted-foreground uppercase tracking-wide">{field.label}</Label>
                      <div className="flex items-center justify-between mt-2">
                        <Button variant="outline" size="icon" type="button" className="h-10 w-10 rounded-lg shadow-sm" onClick={() => handleCounterChange(activeQuestionIndex, field.key, -1, field.min)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-2xl font-black text-foreground w-12 text-center">{value ?? 0}</span>
                        <Button variant="outline" size="icon" type="button" className="h-10 w-10 rounded-lg shadow-sm" onClick={() => handleCounterChange(activeQuestionIndex, field.key, 1, field.min)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                }
                if (field.type === "SLIDER") {
                  return (
                    <div key={field.key} className="space-y-2 bg-muted/20 p-4 rounded-xl border flex flex-col justify-between">
                      <Label className="font-bold text-xs text-muted-foreground uppercase tracking-wide" htmlFor={`field-${field.key}`}>{field.label} ({value ?? 0})</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <input id={`field-${field.key}`} type="range" min={field.min ?? 0} max={field.max ?? 100} value={value ?? 0} onChange={(e) => handleInputChange(activeQuestionIndex, field.key, Number(e.target.value))} className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                        <Input type="number" value={value ?? 0} onChange={(e) => handleInputChange(activeQuestionIndex, field.key, Number(e.target.value))} className="w-20 text-center h-10 font-bold" min={field.min ?? 0} max={field.max ?? 100} />
                      </div>
                    </div>
                  );
                }
                if (field.type === "NUMBER") {
                  return (
                    <div key={field.key} className="space-y-2 bg-muted/20 p-4 rounded-xl border flex flex-col justify-between">
                      <Label className="font-bold text-xs text-muted-foreground uppercase tracking-wide" htmlFor={`field-${field.key}`}>{field.label}</Label>
                      <Input id={`field-${field.key}`} type="number" min={field.min ?? 0} max={field.max ?? 100} value={value ?? 0} onChange={(e) => handleInputChange(activeQuestionIndex, field.key, Number(e.target.value))} className="h-10 mt-2 font-bold text-center bg-background" />
                    </div>
                  );
                }
                if (field.type === "TEXTAREA") {
                  return (
                    <div key={field.key} className="col-span-1 md:col-span-2 space-y-2">
                      <Label className="font-bold text-sm text-foreground">{field.label}</Label>
                      <Textarea placeholder={`Masukkan ${field.label.toLowerCase()}...`} value={value ?? ""} onChange={(e) => handleInputChange(activeQuestionIndex, field.key, e.target.value)} rows={3} className="resize-none" />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 justify-center py-2">
        {questionsData.map((_, index) => (
          <Button key={index} variant={activeQuestionIndex === index ? "default" : "outline"} size="sm" onClick={() => setActiveQuestionIndex(index)} className="w-10 h-10 font-bold rounded-lg shadow-sm">
            {index + 1}
          </Button>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="exam-notes" className="font-bold text-sm text-foreground">Catatan Penguji / Kesimpulan Ujian</Label>
        <Textarea id="exam-notes" placeholder="Tulis catatan penutup atau saran untuk hafalan santri..." value={catatanUjian} onChange={(e) => setCatatanUjian(e.target.value)} rows={2} className="resize-none" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
        <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>Pastikan seluruh pertanyaan ({numQuestions} soal) telah diisi penilaian dan materinya. Rumus: <code>{template.formula_expression}</code>.</p>
        </div>
        <Button onClick={handleSubmit} disabled={loading || !selectedSantri} className="w-full md:w-auto px-12 h-11 font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
          <Calculator className="h-4 w-4" />
          {loading ? "Menghitung & Menyimpan..." : "Selesaikan & Hitung Nilai"}
        </Button>
      </div>
    </div>
  );
}
