import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  Plus,
  Trash2,
  GraduationCap,
  AlertCircle,
  PlusCircle,
  X,
  Play,
  CheckCircle,
  Lock,
  Unlock,
  PlusIcon,
  MinusIcon,
  BookOpen,
  ListOrdered,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type ExamTemplate, type ExamMode, ujianService } from "@/features/setoran/api/ujian-api";
import { toast } from "sonner";

interface SchemaField {
  key: string;
  label: string;
  type: "COUNTER" | "SLIDER" | "TEXTAREA" | "NUMBER";
  min?: number;
  max?: number;
  default?: any;
  isKeyUnlocked?: boolean;
}

// Client-side expression evaluator
function evaluateFormula(expression: string, context: Record<string, number>): number {
  let exprStr = expression;
  const fullContext = { ...context };

  const variableNames = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  for (const name of variableNames) {
    if (!(name in fullContext)) {
      fullContext[name] = 0;
    }
  }

  const keys = Object.keys(fullContext).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedKey}\\b`, "g");
    exprStr = exprStr.replace(regex, fullContext[key].toString());
  }

  const tokens = exprStr.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\(|\))/g) || [];
  const values: number[] = [];
  const ops: string[] = [];

  const precedence = (op: string): number => {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    return 0;
  };

  const applyOp = (op: string, b: number, a: number): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? 0 : a / b;
    }
    return 0;
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!isNaN(Number(t))) {
      values.push(Number(t));
    } else if (t === "(") {
      ops.push(t);
    } else if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        const val2 = values.pop();
        const val1 = values.pop();
        const op = ops.pop();
        if (val1 !== undefined && val2 !== undefined && op !== undefined) {
          values.push(applyOp(op, val2, val1));
        }
      }
      ops.pop();
    } else if (["+", "-", "*", "/"].includes(t)) {
      while (ops.length && precedence(ops[ops.length - 1]) >= precedence(t)) {
        const val2 = values.pop();
        const val1 = values.pop();
        const op = ops.pop();
        if (val1 !== undefined && val2 !== undefined && op !== undefined) {
          values.push(applyOp(op, val2, val1));
        }
      }
      ops.push(t);
    }
  }

  while (ops.length) {
    const val2 = values.pop();
    const val1 = values.pop();
    const op = ops.pop();
    if (val1 !== undefined && val2 !== undefined && op !== undefined) {
      values.push(applyOp(op, val2, val1));
    }
  }

  return values[0] || 0;
}

export default function UjianSettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ExamTemplate | null>(null);

  // Form State
  const [namaUjian, setNamaUjian] = useState("");
  const [examMode, setExamMode] = useState<ExamMode>("MULTI_SOAL");
  const [jumlahSoal, setJumlahSoal] = useState(3);
  const [nilaiPerKesalahan, setNilaiPerKesalahan] = useState(2);
  const [formulaExpression, setFormulaExpression] = useState("100 - (total_salah_jali * 5) - (total_salah_khafi * 2)");
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([
    { key: "salah_jali", label: "Salah Jali", type: "COUNTER", min: 0, default: 0, isKeyUnlocked: false },
    { key: "salah_khafi", label: "Salah Khafi", type: "COUNTER", min: 0, default: 0, isKeyUnlocked: false },
    { key: "catatan", label: "Catatan Soal", type: "TEXTAREA", isKeyUnlocked: false },
  ]);

  // Simulator State
  const [simQuestions, setSimQuestions] = useState<Array<Record<string, any>>>([]);
  const [simActiveQuestionIdx, setSimActiveQuestionIdx] = useState(0);

  // Query: Get templates
  const { data: templates = [], isLoading, error } = useQuery<ExamTemplate[]>({
    queryKey: ["exam-templates"],
    queryFn: async () => {
      const res = await ujianService.getExamTemplates();
      return (res.data || []) as ExamTemplate[];
    },
  });

  // Mutation: Create template
  const createMutation = useMutation({
    mutationFn: (data: Omit<ExamTemplate, "id_template" | "id_sekolah">) =>
      ujianService.createExamTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-templates"] });
      toast.success("Templat ujian berhasil ditambahkan!");
      resetForm();
      setIsCreating(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menambahkan templat");
    },
  });

  // Mutation: Delete template
  const deleteMutation = useMutation({
    mutationFn: (id: number) => ujianService.deleteExamTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-templates"] });
      toast.success("Templat ujian berhasil dihapus!");
      setIsDeleteOpen(false);
      setSelectedTemplate(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menghapus templat");
    },
  });

  const resetForm = () => {
    setNamaUjian("");
    setExamMode("MULTI_SOAL");
    setJumlahSoal(3);
    setNilaiPerKesalahan(2);
    setFormulaExpression("100 - (total_salah_jali * 5) - (total_salah_khafi * 2)");
    setSchemaFields([
      { key: "salah_jali", label: "Salah Jali", type: "COUNTER", min: 0, default: 0, isKeyUnlocked: false },
      { key: "salah_khafi", label: "Salah Khafi", type: "COUNTER", min: 0, default: 0, isKeyUnlocked: false },
      { key: "catatan", label: "Catatan Soal", type: "TEXTAREA", isKeyUnlocked: false },
    ]);
    setSimActiveQuestionIdx(0);
  };

  // Ketika exam_mode berubah, set ulang default formula dan schema
  const handleExamModeChange = (mode: ExamMode) => {
    setExamMode(mode);
    if (mode === "SINGLE_PASS") {
      setFormulaExpression("100 - (total_jumlah_kesalahan * nilai_per_kesalahan)");
      setSchemaFields([
        { key: "jumlah_kesalahan", label: "Jumlah Kesalahan", type: "COUNTER", min: 0, default: 0, isKeyUnlocked: false },
      ]);
      setJumlahSoal(1);
    } else {
      setFormulaExpression("100 - (total_salah_jali * 5) - (total_salah_khafi * 2)");
      setSchemaFields([
        { key: "salah_jali", label: "Salah Jali", type: "COUNTER", min: 0, default: 0, isKeyUnlocked: false },
        { key: "salah_khafi", label: "Salah Khafi", type: "COUNTER", min: 0, default: 0, isKeyUnlocked: false },
        { key: "catatan", label: "Catatan Soal", type: "TEXTAREA", isKeyUnlocked: false },
      ]);
      setJumlahSoal(3);
    }
    setSimActiveQuestionIdx(0);
  };

  const handleOpenDelete = (temp: ExamTemplate) => {
    setSelectedTemplate(temp);
    setIsDeleteOpen(true);
  };

  const handleAddSchemaField = () => {
    setSchemaFields((prev) => [
      ...prev,
      { key: "", label: "", type: "COUNTER", min: 0, default: 0, isKeyUnlocked: false },
    ]);
  };

  const handleRemoveSchemaField = (index: number) => {
    setSchemaFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, updatedField: Partial<SchemaField>) => {
    setSchemaFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updatedField } as SchemaField;
      return updated;
    });
  };

  const handleLabelChange = (index: number, label: string) => {
    const field = schemaFields[index];
    if (field.isKeyUnlocked) {
      handleFieldChange(index, { label });
    } else {
      const generatedKey = label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
      handleFieldChange(index, { label, key: generatedKey });
    }
  };

  const handleToggleKeyLock = (index: number) => {
    const field = schemaFields[index];
    const isUnlocked = !field.isKeyUnlocked;
    handleFieldChange(index, { isKeyUnlocked: isUnlocked });
    if (!isUnlocked) {
      const generatedKey = field.label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
      handleFieldChange(index, { key: generatedKey, isKeyUnlocked: isUnlocked });
    }
  };

  const handleKeyManualChange = (index: number, rawKey: string) => {
    const sanitizedKey = rawKey
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_");
    handleFieldChange(index, { key: sanitizedKey });
  };

  const handleInsertToken = (token: string) => {
    setFormulaExpression((prev) => {
      const cleanPrev = prev.trim();
      if (cleanPrev.length === 0) return token;
      const lastChar = cleanPrev[cleanPrev.length - 1];
      const isOperator = ["+", "-", "*", "/", "(", ")"].includes(token);
      const isLastCharOperator = ["+", "-", "*", "/", "(", ")"].includes(lastChar);
      
      if (isOperator || isLastCharOperator) {
        return `${prev} ${token}`;
      }
      return `${prev} - ${token}`;
    });
  };

  useEffect(() => {
    setSimQuestions(
      Array.from({ length: jumlahSoal }, (_, qIdx) => {
        const existingQuestion = simQuestions[qIdx] || {};
        const questionValues: Record<string, any> = {};
        
        schemaFields.forEach((field) => {
          if (field.key && field.type !== "TEXTAREA") {
            questionValues[field.key] =
              existingQuestion[field.key] !== undefined
                ? existingQuestion[field.key]
                : field.default !== undefined
                ? field.default
                : 0;
          }
        });
        return questionValues;
      })
    );
    if (simActiveQuestionIdx >= jumlahSoal) {
      setSimActiveQuestionIdx(0);
    }
  }, [jumlahSoal, schemaFields]);

  const simContext = useMemo(() => {
    const context: Record<string, number> = {};
    const variableLists: Record<string, number[]> = {};

    simQuestions.forEach((q) => {
      Object.keys(q).forEach((key) => {
        const val = q[key];
        if (typeof val === "number") {
          if (!variableLists[key]) {
            variableLists[key] = [];
          }
          variableLists[key].push(val);
        }
      });
    });

    Object.keys(variableLists).forEach((key) => {
      const list = variableLists[key];
      const total = list.reduce((a, b) => a + b, 0);
      context[`total_${key}`] = total;
      context[`avg_${key}`] = list.length > 0 ? total / list.length : 0;
      context[`max_${key}`] = Math.max(...list);
      context[`min_${key}`] = Math.min(...list);
    });

    return context;
  }, [simQuestions]);

  const simulationResult = useMemo(() => {
    if (!formulaExpression.trim()) return { success: false, result: 0, error: "Rumus kosong" };
    try {
      const value = evaluateFormula(formulaExpression, simContext);
      const normalizedValue = Math.max(0, Math.min(100, Math.round(value * 100) / 100));
      return { success: true, result: normalizedValue, error: null };
    } catch (err: any) {
      return { success: false, result: 0, error: "Rumus tidak valid" };
    }
  }, [formulaExpression, simContext]);

  const handleSimQuestionValueChange = (qIndex: number, key: string, value: number) => {
    setSimQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIndex]) {
        updated[qIndex] = { ...updated[qIndex], [key]: value };
      }
      return updated;
    });
  };

  const handleSimCounterDelta = (qIndex: number, key: string, delta: number, min = 0) => {
    const curVal = simQuestions[qIndex]?.[key] ?? 0;
    const newVal = Math.max(min, curVal + delta);
    handleSimQuestionValueChange(qIndex, key, newVal);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaUjian.trim()) {
      toast.warning("Nama ujian tidak boleh kosong");
      return;
    }
    if (!formulaExpression.trim()) {
      toast.warning("Rumus penilaian tidak boleh kosong");
      return;
    }

    const invalidField = schemaFields.find((f) => !f.key.trim() || !f.label.trim());
    if (invalidField) {
      toast.warning("Harap isi semua key dan label kriteria input");
      return;
    }

    const payload = {
      nama_ujian: namaUjian,
      exam_mode: examMode,
      formula_expression: formulaExpression,
      soal_rules: examMode === "SINGLE_PASS"
        ? {
            nilai_per_kesalahan: nilaiPerKesalahan,
            auto_range_from_setoran: true,
            periode: "BULANAN",
          }
        : {
            jumlah_soal: jumlahSoal,
            mode: "QURAN_RANGE",
          },
      input_schema: schemaFields.map(({ key, label, type, min, max, default: def }) => ({
        key,
        label,
        type,
        ...(min !== undefined && { min }),
        ...(max !== undefined && { max }),
        ...(def !== undefined && { default: def }),
      })),
    };

    createMutation.mutate(payload as any);
  };

  const handleDelete = () => {
    if (selectedTemplate) {
      deleteMutation.mutate(selectedTemplate.id_template);
    }
  };

  // Render Full-Page Create/Edit Form View
  if (isCreating) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
        {/* Header Rute Form */}
        <div className="flex items-center gap-4 border-b pb-5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              resetForm();
              setIsCreating(false);
            }}
            className="rounded-full h-9 w-9 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight">Tambah Templat Ujian</h1>
            <p className="text-xs text-muted-foreground">
              Konfigurasi kriteria, kalkulator formula nilai, dan simulator ujian
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sisi Kiri: Detail Templat & Kriteria */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Informasi Dasar */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Informasi Utama Ujian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nama Ujian */}
                <div className="space-y-2">
                  <Label htmlFor="exam-name" className="text-xs font-semibold">Nama Ujian</Label>
                  <Input
                    id="exam-name"
                    placeholder="Contoh: Ujian Pekanan Baru"
                    value={namaUjian}
                    onChange={(e) => setNamaUjian(e.target.value)}
                    required
                  />
                </div>

                {/* Mode Ujian */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Mode Ujian</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleExamModeChange("MULTI_SOAL")}
                      className={`flex flex-col gap-1.5 p-3 rounded-lg border-2 text-left transition-all ${
                        examMode === "MULTI_SOAL"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-muted-foreground/40 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ListOrdered className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-bold">Multi Soal</span>
                      </div>
                      <span className="text-[10px] leading-relaxed">
                        Soal diinput per butir. Cocok untuk <strong>Ujian Pekanan</strong>.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExamModeChange("SINGLE_PASS")}
                      className={`flex flex-col gap-1.5 p-3 rounded-lg border-2 text-left transition-all ${
                        examMode === "SINGLE_PASS"
                          ? "border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                          : "border-border hover:border-muted-foreground/40 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-bold">Single Pass</span>
                      </div>
                      <span className="text-[10px] leading-relaxed">
                        Satu penilaian global. Cocok untuk <strong>Ujian Bulanan</strong>.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Jumlah Soal (MULTI_SOAL) atau Nilai Per Kesalahan (SINGLE_PASS) */}
                {examMode === "MULTI_SOAL" ? (
                  <div className="space-y-2">
                    <Label htmlFor="exam-questions" className="text-xs font-semibold">Jumlah Soal</Label>
                    <Input
                      id="exam-questions"
                      type="number"
                      min={1}
                      max={10}
                      value={jumlahSoal}
                      onChange={(e) => setJumlahSoal(Number(e.target.value))}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="exam-nilai-per-kesalahan" className="text-xs font-semibold">
                      Pengurangan Nilai per Kesalahan
                    </Label>
                    <Input
                      id="exam-nilai-per-kesalahan"
                      type="number"
                      min={0.5}
                      max={20}
                      step={0.5}
                      value={nilaiPerKesalahan}
                      onChange={(e) => setNilaiPerKesalahan(Number(e.target.value))}
                      required
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Contoh: nilai 2 → setiap kesalahan kurangi 2 poin dari 100
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card 2: Kriteria Builder */}
            <Card>
              <CardHeader className="pb-4 flex flex-row justify-between items-center space-y-0">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Kriteria Input Soal
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Tentukan field penilaian untuk setiap butir soal ujian
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSchemaField}
                  className="h-8 text-xs gap-1"
                >
                  <PlusCircle className="h-4 w-4 text-primary" />
                  Kriteria Baru
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {schemaFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-4 border rounded-lg bg-card relative space-y-3"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSchemaField(idx)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive absolute top-3 right-3 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-12 gap-3 pt-1">
                      <div className="col-span-6 space-y-1.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Label Tampilan
                        </Label>
                        <Input
                          placeholder="Contoh: Salah Jali"
                          value={field.label}
                          onChange={(e) => handleLabelChange(idx, e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="col-span-6 space-y-1.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                          <span>Key Variabel</span>
                          <button
                            type="button"
                            onClick={() => handleToggleKeyLock(idx)}
                            className="text-primary transition text-[10px] font-bold flex items-center gap-0.5"
                          >
                            {field.isKeyUnlocked ? (
                              <>
                                <Unlock className="h-3.5 w-3.5 text-orange-500" />
                                <span>Manual</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Auto</span>
                              </>
                            )}
                          </button>
                        </Label>
                        <Input
                          placeholder="salah_jali"
                          value={field.key}
                          onChange={(e) => handleKeyManualChange(idx, e.target.value)}
                          readOnly={!field.isKeyUnlocked}
                          className={`h-9 text-xs font-mono font-bold ${
                            field.isKeyUnlocked
                              ? "bg-background border-primary/40 focus:ring-primary"
                              : "bg-muted/40 cursor-not-allowed border-dashed text-primary/80"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-6 space-y-1.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Tipe Input
                        </Label>
                        <Select
                          value={field.type}
                          onValueChange={(val: any) => handleFieldChange(idx, { type: val })}
                        >
                          <SelectTrigger className="h-9 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="COUNTER">COUNTER (Tombol +/-)</SelectItem>
                            <SelectItem value="SLIDER">SLIDER (Rentang range)</SelectItem>
                            <SelectItem value="NUMBER">NUMBER (Input Angka)</SelectItem>
                            <SelectItem value="TEXTAREA">TEXTAREA (Catatan)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {field.type !== "TEXTAREA" && (
                        <div className="col-span-6 grid grid-cols-3 gap-2">
                          <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-muted-foreground uppercase">Min</Label>
                            <Input
                              type="number"
                              value={field.min ?? 0}
                              onChange={(e) => handleFieldChange(idx, { min: Number(e.target.value) })}
                              className="h-9 text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-muted-foreground uppercase">Max</Label>
                            <Input
                              type="number"
                              value={field.max ?? 100}
                              onChange={(e) => handleFieldChange(idx, { max: Number(e.target.value) })}
                              className="h-9 text-xs"
                              disabled={field.type === "COUNTER"}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-muted-foreground uppercase">Bawaan</Label>
                            <Input
                              type="number"
                              value={field.default ?? 0}
                              onChange={(e) => handleFieldChange(idx, { default: Number(e.target.value) })}
                              className="h-9 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sisi Kanan: Formula & Sandbox Simulator */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 3: Formula & Operator */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Formula & Kalkulator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="exam-formula"
                    placeholder="Tulis rumus di sini..."
                    value={formulaExpression}
                    onChange={(e) => setFormulaExpression(e.target.value)}
                    required
                    className="font-mono text-xs h-10"
                  />

                  {/* Math Operators keypad */}
                  <div className="flex gap-1">
                    {["+", "-", "*", "/", "(", ")"].map((op) => (
                      <Button
                        key={op}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInsertToken(op)}
                        className="h-7 w-7 text-xs font-mono font-bold p-0"
                      >
                        {op}
                      </Button>
                    ))}
                  </div>

                  {/* Variables Helper List */}
                  <div className="border border-dashed rounded-lg p-3 bg-muted/20 mt-3 space-y-2">
                    <span className="text-[9px] font-bold text-muted-foreground block uppercase tracking-wider">
                      Klik lencana untuk memasukkan token:
                    </span>
                    <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                      {schemaFields.filter(f => f.key && f.type !== "TEXTAREA").map((field) => (
                        <div key={field.key} className="space-y-1">
                          <span className="text-[8px] font-extrabold text-primary font-mono uppercase block">
                            » {field.label}:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {["total", "avg", "max", "min"].map((op) => {
                              const tokenName = `${op}_${field.key}`;
                              return (
                                <Badge
                                  key={tokenName}
                                  onClick={() => handleInsertToken(tokenName)}
                                  className="cursor-pointer font-mono text-[9px] px-1.5 py-0.5 rounded"
                                  variant="secondary"
                                >
                                  {tokenName}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {schemaFields.filter(f => f.key && f.type !== "TEXTAREA").length === 0 && (
                        <span className="text-[9px] text-muted-foreground italic">
                          Belum ada variabel kriteria numerik aktif...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Simulator Sandbox */}
            <Card>
              <CardHeader className="pb-4 flex flex-row justify-between items-center space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Play className="h-4 w-4 fill-primary text-primary" />
                  Uji Coba Sandbox (Simulator)
                </CardTitle>
                {simulationResult.success ? (
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 text-[9px] font-bold hover:bg-emerald-500/10">
                    <CheckCircle className="h-3 w-3 mr-1 inline" /> Rumus Valid
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-[9px] font-bold">
                    ⚠️ {simulationResult.error}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {schemaFields.filter(f => f.key && f.type !== "TEXTAREA").length === 0 ? (
                  <div className="text-center py-6 text-[10px] text-muted-foreground italic">
                    Definisikan kriteria input di sebelah kiri untuk mencoba simulator ujian...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Navigation Tab Uji Soal */}
                    <div className="flex justify-between items-center bg-muted/20 rounded-lg border p-2">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                        Soal Uji #{simActiveQuestionIdx + 1}
                      </span>
                      <div className="flex gap-1.5">
                        {Array.from({ length: jumlahSoal }).map((_, idx) => (
                          <Button
                            key={idx}
                            type="button"
                            variant={simActiveQuestionIdx === idx ? "default" : "outline"}
                            size="sm"
                            className="h-6 w-6 text-[10px] font-bold p-0 rounded"
                            onClick={() => setSimActiveQuestionIdx(idx)}
                          >
                            {idx + 1}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 min-h-[100px] flex flex-col justify-center">
                      {schemaFields
                        .filter((field) => field.key && field.type !== "TEXTAREA")
                        .map((field) => {
                          const value = simQuestions[simActiveQuestionIdx]?.[field.key] ?? 0;

                          if (field.type === "COUNTER") {
                            return (
                              <div key={field.key} className="flex justify-between items-center gap-4 bg-muted/10 p-2 rounded-lg border">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                  {field.label}
                                </span>
                                <div className="flex items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-7 w-7 rounded p-0"
                                    onClick={() => handleSimCounterDelta(simActiveQuestionIdx, field.key, -1, field.min)}
                                  >
                                    <MinusIcon className="h-3 w-3" />
                                  </Button>
                                  <span className="text-xs font-black w-6 text-center">{value}</span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-7 w-7 rounded p-0"
                                    onClick={() => handleSimCounterDelta(simActiveQuestionIdx, field.key, 1, field.min)}
                                  >
                                    <PlusIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }

                          if (field.type === "SLIDER") {
                            return (
                              <div key={field.key} className="space-y-1 bg-muted/10 p-2 rounded-lg border">
                                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                                  <span>{field.label}</span>
                                  <span className="font-black text-primary font-mono">({value})</span>
                                </div>
                                <input
                                  type="range"
                                  min={field.min ?? 0}
                                  max={field.max ?? 100}
                                  value={value}
                                  onChange={(e) => handleSimQuestionValueChange(simActiveQuestionIdx, field.key, Number(e.target.value))}
                                  className="w-full accent-primary h-1 bg-muted rounded appearance-none cursor-pointer mt-1"
                                />
                              </div>
                            );
                          }

                          if (field.type === "NUMBER") {
                            return (
                              <div key={field.key} className="space-y-1 bg-muted/10 p-2 rounded-lg border">
                                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                                  <span>{field.label}</span>
                                </div>
                                <Input
                                  type="number"
                                  min={field.min ?? 0}
                                  max={field.max ?? 100}
                                  value={value}
                                  onChange={(e) => handleSimQuestionValueChange(simActiveQuestionIdx, field.key, Number(e.target.value))}
                                  className="h-8.5 text-xs font-bold text-center mt-1 bg-background"
                                />
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>

                    {/* Output Hasil */}
                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-dashed">
                      <div className="bg-muted/10 rounded-lg p-2.5 text-center flex flex-col justify-center items-center shadow-sm border">
                        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
                          Total Kesalahan
                        </span>
                        <span className="text-sm font-extrabold text-destructive mt-0.5">
                          {simContext.total_salah_jali || simContext.total_salah || 0}
                        </span>
                      </div>

                      <div className="bg-muted/10 rounded-lg p-2.5 text-center flex flex-col justify-center items-center shadow-sm border">
                        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
                          Simulasi Nilai
                        </span>
                        <span className="text-base font-black text-primary mt-0.5">
                          {simulationResult.success ? simulationResult.result : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer Submit Buttons */}
          <div className="col-span-12 flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsCreating(false);
              }}
              className="h-10 px-6 text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !simulationResult.success}
              className="h-10 px-8 text-xs font-bold"
            >
              {createMutation.isPending ? "Menyimpan..." : "Simpan Templat"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Render Table List Page View (Default)
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-5">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/kepala-muhafidz/settings")}
            className="rounded-full h-9 w-9 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Kelola Templat Ujian
            </h1>
            <p className="text-xs text-muted-foreground">
              Kelola kriteria input dan rumus grading penilaian ujian otomatis
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="font-semibold text-xs h-8.5 gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Templat
        </Button>
      </div>

      {/* INFO BANNER */}
      <Alert className="bg-muted/30 border">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertTitle className="text-xs font-bold uppercase tracking-wider text-primary">
          Grading Engine
        </AlertTitle>
        <AlertDescription className="text-xs leading-relaxed mt-1">
          Sistem penilaian otomatis mengevaluasi rumus yang dibuat berdasarkan data input ujian.
          Anda dapat menggunakan rumus matematika umum dan menunjuk variabel kriteria menggunakan token.
        </AlertDescription>
      </Alert>

      {/* TABLE CARD */}
      <Card className="shadow-sm">
        <CardHeader className="py-4 px-6 border-b">
          <CardTitle className="text-sm font-bold">Templat Ujian Aktif</CardTitle>
          <CardDescription className="text-xs">
            Daftar opsi ujian kustom yang saat ini terintegrasi di sistem sekolah Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Memuat templat...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-destructive font-medium">
              Gagal memuat templat: {error.message}
            </div>
          ) : templates.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground space-y-2">
              <GraduationCap className="h-8 w-8 mx-auto opacity-30 text-muted-foreground" />
              <p className="font-medium">Belum ada templat ujian kustom</p>
              <p className="text-xs">Klik tombol &quot;Tambah Templat&quot; di atas untuk membuat.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-1/4 font-semibold text-xs">Nama Ujian</TableHead>
                  <TableHead className="w-[100px] font-semibold text-xs text-center">Mode</TableHead>
                  <TableHead className="font-semibold text-xs">Kriteria Input</TableHead>
                  <TableHead className="w-[200px] font-semibold text-xs">Rumus Penilaian</TableHead>
                  <TableHead className="w-[100px] font-semibold text-xs text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((temp) => (
                  <TableRow key={temp.id_template} className="transition-all hover:bg-muted/10">
                    <TableCell className="font-bold text-sm text-foreground py-3.5">
                      {temp.nama_ujian}
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      {temp.exam_mode === "SINGLE_PASS" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 text-[9px] font-bold hover:bg-emerald-500/10">
                          <BookOpen className="h-2.5 w-2.5 mr-1 inline" />
                          Single Pass
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[9px] font-bold">
                          <ListOrdered className="h-2.5 w-2.5 mr-1 inline" />
                          {temp.soal_rules?.jumlah_soal || "?"} Soal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 flex flex-wrap gap-1 max-w-[250px]">
                      {temp.input_schema?.map((f) => (
                        <Badge key={f.key} variant="secondary" className="text-[9px] px-1.5 py-0">
                          {f.label} ({f.type})
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground py-3.5">
                      {temp.formula_expression}
                    </TableCell>
                    <TableCell className="text-right py-3.5 pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(temp)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* CONFIRMATION DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus templat ujian{" "}
              <strong>{selectedTemplate?.nama_ujian}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="h-9.5 font-semibold text-xs"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="h-9.5 font-semibold text-xs"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
