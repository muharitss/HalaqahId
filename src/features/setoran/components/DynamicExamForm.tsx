"use client";

import { useState, useEffect } from "react";
import { type ExamTemplate, ujianService } from "../api/ujian-api";
import { type Santri } from "@/features/santri/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, AlertCircle, Plus, Minus, Calculator, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner"; // or any toast library used in project, let's use console/alert fallback just in case, but let's check what is used.

interface DynamicExamFormProps {
  template: ExamTemplate;
  santriList: Santri[];
  sesiList: Array<{ id_sesi: number; nama_sesi: string }>;
  onSuccess: () => void;
}

export function DynamicExamForm({ template, santriList, sesiList, onSuccess }: DynamicExamFormProps) {
  const [selectedSantri, setSelectedSantri] = useState<number | null>(null);
  const [selectedSesi, setSelectedSesi] = useState<number | null>(null);
  const [catatanUjian, setCatatanUjian] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const numQuestions = template.soal_rules?.jumlah_soal || 3;

  // State to hold data for each question
  const [questionsData, setQuestionsData] = useState<Array<{
    nomor_soal: number;
    materi_soal: string;
    input_values: Record<string, any>;
  }>>([]);

  // Initialize questions data based on template input schema
  useEffect(() => {
    const initialQuestions = Array.from({ length: numQuestions }, (_, i) => {
      const initialInputs: Record<string, any> = {};
      template.input_schema.forEach((field) => {
        initialInputs[field.key] = field.default !== undefined ? field.default : (field.type === "COUNTER" || field.type === "NUMBER" || field.type === "SLIDER" ? 0 : "");
      });
      return {
        nomor_soal: i + 1,
        materi_soal: "",
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
      updated[questionIndex] = {
        ...updated[questionIndex],
        input_values: {
          ...updated[questionIndex].input_values,
          [key]: value,
        },
      };
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
      console.error(err);
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
              Santri mendapatkan nilai akhir <strong>{result.nilai_akhir}</strong> dengan predikat <strong>{result.predikat}</strong>. Sesi ujian tercatat di database dengan ID Sesi #{result.session?.id_sesi_ujian}.
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
        {/* Pilih Santri */}
        <div className="space-y-2">
          <Label htmlFor="exam-santri" className="font-bold text-foreground">Santri yang Diuji</Label>
          <Select
            onValueChange={(v) => setSelectedSantri(Number(v))}
            value={selectedSantri?.toString()}
          >
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

        {/* Pilih Sesi */}
        <div className="space-y-2">
          <Label htmlFor="exam-sesi" className="font-bold text-foreground">Sesi Halaqah</Label>
          <Select
            onValueChange={(v) => setSelectedSesi(Number(v))}
            value={selectedSesi?.toString()}
          >
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

      {/* Box Soal Aktif */}
      {activeQuestion && (
        <Card className="border border-primary/10 shadow-sm relative overflow-hidden bg-card">
          <div className="bg-primary/5 px-6 py-4 flex justify-between items-center border-b">
            <span className="font-black text-primary text-sm tracking-wider uppercase">
              Pertanyaan {activeQuestionIndex + 1} dari {numQuestions}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={activeQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => setActiveQuestionIndex(prev => Math.min(numQuestions - 1, prev + 1))}
                disabled={activeQuestionIndex === numQuestions - 1}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Input Deskripsi Ayat / Soal */}
            <div className="space-y-2">
              <Label className="font-bold text-sm text-foreground">Materi Uji (Surah / Ayat)</Label>
              <Input
                placeholder="Contoh: Surat Al-Baqarah ayat 1-10 atau Soal Sambung Ayat"
                value={activeQuestion.materi_soal}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuestionsData(prev => {
                    const updated = [...prev];
                    updated[activeQuestionIndex].materi_soal = val;
                    return updated;
                  });
                }}
                className="h-11"
              />
            </div>

            {/* Dynamic Inputs from Schema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {template.input_schema.map((field) => {
                const value = activeQuestion.input_values[field.key];

                if (field.type === "COUNTER") {
                  return (
                    <div key={field.key} className="space-y-2 bg-muted/20 p-4 rounded-xl border flex flex-col justify-between">
                      <Label className="font-bold text-xs text-muted-foreground uppercase tracking-wide">{field.label}</Label>
                      <div className="flex items-center justify-between mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          className="h-10 w-10 rounded-lg shadow-sm"
                          onClick={() => handleCounterChange(activeQuestionIndex, field.key, -1, field.min)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-2xl font-black text-foreground w-12 text-center">{value ?? 0}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          className="h-10 w-10 rounded-lg shadow-sm"
                          onClick={() => handleCounterChange(activeQuestionIndex, field.key, 1, field.min)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                }

                if (field.type === "SLIDER" || field.type === "NUMBER") {
                  return (
                    <div key={field.key} className="space-y-2 bg-muted/20 p-4 rounded-xl border flex flex-col justify-between">
                      <Label className="font-bold text-xs text-muted-foreground uppercase tracking-wide" htmlFor={`field-${field.key}`}>
                        {field.label} ({value ?? 0})
                      </Label>
                      <div className="flex items-center gap-4 mt-2">
                        <input
                          id={`field-${field.key}`}
                          type="range"
                          min={field.min ?? 0}
                          max={field.max ?? 100}
                          value={value ?? 0}
                          onChange={(e) => handleInputChange(activeQuestionIndex, field.key, Number(e.target.value))}
                          className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <Input
                          type="number"
                          value={value ?? 0}
                          onChange={(e) => handleInputChange(activeQuestionIndex, field.key, Number(e.target.value))}
                          className="w-20 text-center h-10 font-bold"
                          min={field.min ?? 0}
                          max={field.max ?? 100}
                        />
                      </div>
                    </div>
                  );
                }

                if (field.type === "TEXTAREA") {
                  return (
                    <div key={field.key} className="col-span-1 md:col-span-2 space-y-2">
                      <Label className="font-bold text-sm text-foreground">{field.label}</Label>
                      <Textarea
                        placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                        value={value ?? ""}
                        onChange={(e) => handleInputChange(activeQuestionIndex, field.key, e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indikator Pengerjaan / Progress */}
      <div className="flex flex-wrap gap-2 justify-center py-2">
        {questionsData.map((_, index) => (
          <Button
            key={index}
            variant={activeQuestionIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveQuestionIndex(index)}
            className="w-10 h-10 font-bold rounded-lg shadow-sm"
          >
            {index + 1}
          </Button>
        ))}
      </div>

      {/* Catatan Ujian Global */}
      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="exam-notes" className="font-bold text-sm text-foreground">Catatan Penguji / Kesimpulan Ujian</Label>
        <Textarea
          id="exam-notes"
          placeholder="Tulis catatan penutup atau saran untuk hafalan santri..."
          value={catatanUjian}
          onChange={(e) => setCatatanUjian(e.target.value)}
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
        <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Pastikan seluruh pertanyaan ({numQuestions} soal) telah diisi penilaian dan materinya sebelum menyimpan ujian. Rumus penilaian sekolah: <code>{template.formula_expression}</code>.
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
