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
  Calendar as CalendarIcon,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  type ExamTemplate,
  type ExamSchedule,
  type ExamMode,
  ujianService,
} from "@/features/setoran/api/ujian-api";
import { toast } from "sonner";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";

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
function evaluateFormula(
  expression: string,
  context: Record<string, number>,
): number {
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
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? 0 : a / b;
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

  const [activeTab, setActiveTab] = useState<"templates" | "calendar">(
    "templates",
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ExamTemplate | null>(
    null,
  );

  // Form State Tambahan
  const [tipeUjian, setTipeUjian] = useState<"PEKANAN" | "BULANAN" | "HARIAN" | "KUSTOM">("KUSTOM");
  const [filterJenisKategori, setFilterJenisKategori] = useState<string[]>([]);
  const [soalAcakTanpaDetail, setSoalAcakTanpaDetail] = useState(false);

  const applyPresetPekanan = () => {
    setNamaUjian("Ujian Pekanan Hafalan");
    setTipeUjian("PEKANAN");
    setExamMode("SINGLE_PASS");
    setJumlahSoal(1);
    setFormulaExpression("100 - (jumlah_kesalahan * 2)");
    setFilterJenisKategori(["ZIYADAH", "TASMI", "BACAAN"]);
    setSoalAcakTanpaDetail(false);
    setSchemaFields([
      {
        key: "jumlah_kesalahan",
        label: "Jumlah Kesalahan",
        type: "COUNTER",
        min: 0,
        default: 0,
        isKeyUnlocked: false,
      }
    ]);
  };

  const applyPresetBulanan = () => {
    setNamaUjian("Ujian Bulanan Hafalan");
    setTipeUjian("BULANAN");
    setExamMode("MULTI_SOAL");
    setJumlahSoal(5);
    setFormulaExpression("100 - (total_jumlah_kesalahan * 2)");
    setFilterJenisKategori(["ZIYADAH", "TASMI", "BACAAN"]);
    setSoalAcakTanpaDetail(true);
    setSchemaFields([
      {
        key: "jumlah_kesalahan",
        label: "Jumlah Kesalahan",
        type: "COUNTER",
        min: 0,
        default: 0,
        isKeyUnlocked: false,
      }
    ]);
  };

  // Form State Template
  const [namaUjian, setNamaUjian] = useState("");
  const [examMode, setExamMode] = useState<ExamMode>("MULTI_SOAL");
  const [jumlahSoal, setJumlahSoal] = useState(3);
  const [formulaExpression, setFormulaExpression] = useState(
    "100 - (total_salah_jali * 5) - (total_salah_khafi * 2)",
  );
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([
    {
      key: "salah_jali",
      label: "Salah Jali",
      type: "COUNTER",
      min: 0,
      default: 0,
      isKeyUnlocked: false,
    },
    {
      key: "salah_khafi",
      label: "Salah Khafi",
      type: "COUNTER",
      min: 0,
      default: 0,
      isKeyUnlocked: false,
    },
    {
      key: "catatan",
      label: "Catatan Soal",
      type: "TEXTAREA",
      isKeyUnlocked: false,
    },
  ]);

  // Simulator State
  const [simQuestions, setSimQuestions] = useState<Array<Record<string, any>>>(
    [],
  );
  const [simActiveQuestionIdx, setSimActiveQuestionIdx] = useState(0);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isJadwalModalOpen, setIsJadwalModalOpen] = useState(false);
  const [isEditJadwalOpen, setIsEditJadwalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(
    null,
  );

  // Form State Jadwal
  const [jadwalTitle, setJadwalTitle] = useState("");
  const [jadwalTemplateId, setJadwalTemplateId] = useState<string>("");
  const [jadwalDate, setJadwalDate] = useState("");
  const [periodeStart, setPeriodeStart] = useState("");
  const [periodeEnd, setPeriodeEnd] = useState("");
  const [jadwalStatus, setJadwalStatus] = useState<
    "DRAFT" | "AKTIF" | "SELESAI" | "DIBATALKAN"
  >("DRAFT");
  const [jadwalNotes, setJadwalNotes] = useState("");

  // Query: Get templates
  const {
    data: templates = [],
    isLoading: isLoadingTemplates,
    error: errorTemplates,
  } = useQuery<ExamTemplate[]>({
    queryKey: ["exam-templates"],
    queryFn: async () => {
      const res = await ujianService.getExamTemplates();
      return (res.data || []) as ExamTemplate[];
    },
  });

  // Query: Get schedules for the calendar
  const { data: schedules = [], isLoading: isLoadingSchedules } = useQuery<
    ExamSchedule[]
  >({
    queryKey: ["exam-schedules", currentMonth.toISOString()],
    queryFn: async () => {
      const start = startOfWeek(startOfMonth(currentMonth), {
        weekStartsOn: 1,
      }).toISOString();
      const end = endOfWeek(endOfMonth(currentMonth), {
        weekStartsOn: 1,
      }).toISOString();
      const res = await ujianService.getExamSchedules({
        start_date: start,
        end_date: end,
      });
      return (res.data || []) as ExamSchedule[];
    },
  });

  // Mutations
  const createTemplateMutation = useMutation({
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

  const deleteTemplateMutation = useMutation({
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

  const createScheduleMutation = useMutation({
    mutationFn: (payload: any) => ujianService.createExamSchedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-schedules"] });
      toast.success("Jadwal ujian berhasil dibuat!");
      setIsJadwalModalOpen(false);
      clearJadwalForm();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal membuat jadwal ujian");
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      ujianService.updateExamSchedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-schedules"] });
      toast.success("Jadwal ujian berhasil diperbarui!");
      setIsEditJadwalOpen(false);
      setSelectedSchedule(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal memperbarui jadwal");
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: number) => ujianService.deleteExamSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-schedules"] });
      toast.success("Jadwal ujian berhasil dihapus!");
      setIsEditJadwalOpen(false);
      setSelectedSchedule(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menghapus jadwal");
    },
  });

  const lockSnapshotMutation = useMutation({
    mutationFn: (id: number) => ujianService.lockSnapshot(id),
    onSuccess: (res: any) => {
      toast.success(
        `Snapshot berhasil dikunci untuk ${res.data?.santri_count || 0} santri!`,
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal mengunci snapshot materi");
    },
  });

  const resetForm = () => {
    setNamaUjian("");
    setTipeUjian("KUSTOM");
    setFilterJenisKategori([]);
    setSoalAcakTanpaDetail(false);
    setExamMode("MULTI_SOAL");
    setJumlahSoal(3);
    setFormulaExpression(
      "100 - (total_salah_jali * 5) - (total_salah_khafi * 2)",
    );
    setSchemaFields([
      {
        key: "salah_jali",
        label: "Salah Jali",
        type: "COUNTER",
        min: 0,
        default: 0,
        isKeyUnlocked: false,
      },
      {
        key: "salah_khafi",
        label: "Salah Khafi",
        type: "COUNTER",
        min: 0,
        default: 0,
        isKeyUnlocked: false,
      },
      {
        key: "catatan",
        label: "Catatan Soal",
        type: "TEXTAREA",
        isKeyUnlocked: false,
      },
    ]);
    setSimActiveQuestionIdx(0);
  };

  const clearJadwalForm = () => {
    setJadwalTitle("");
    setJadwalTemplateId("");
    setJadwalDate("");
    setPeriodeStart("");
    setPeriodeEnd("");
    setJadwalStatus("DRAFT");
    setJadwalNotes("");
  };

  const handleExamModeChange = (mode: ExamMode) => {
    setExamMode(mode);
    if (mode === "SINGLE_PASS") {
      setFormulaExpression("100 - (jumlah_kesalahan * 2)");
      setSchemaFields([
        {
          key: "jumlah_kesalahan",
          label: "Jumlah Kesalahan",
          type: "COUNTER",
          min: 0,
          default: 0,
          isKeyUnlocked: false,
        },
      ]);
      setJumlahSoal(1);
    } else {
      setFormulaExpression(
        "100 - (total_salah_jali * 5) - (total_salah_khafi * 2)",
      );
      setSchemaFields([
        {
          key: "salah_jali",
          label: "Salah Jali",
          type: "COUNTER",
          min: 0,
          default: 0,
          isKeyUnlocked: false,
        },
        {
          key: "salah_khafi",
          label: "Salah Khafi",
          type: "COUNTER",
          min: 0,
          default: 0,
          isKeyUnlocked: false,
        },
        {
          key: "catatan",
          label: "Catatan Soal",
          type: "TEXTAREA",
          isKeyUnlocked: false,
        },
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
      {
        key: "",
        label: "",
        type: "COUNTER",
        min: 0,
        default: 0,
        isKeyUnlocked: false,
      },
    ]);
  };

  const handleRemoveSchemaField = (index: number) => {
    setSchemaFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    updatedField: Partial<SchemaField>,
  ) => {
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
      const generatedKey = normalizeSchemaKey(label);
      handleFieldChange(index, { label, key: generatedKey });
    }
  };

  const normalizeSchemaKey = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const handleToggleKeyLock = (index: number) => {
    setSchemaFields((prev) => {
      const updated = [...prev];
      const field = updated[index];
      const nextUnlocked = !field.isKeyUnlocked;

      updated[index] = {
        ...field,
        isKeyUnlocked: nextUnlocked,
        key: nextUnlocked ? field.key : normalizeSchemaKey(field.label),
      };

      return updated;
    });
  };

  const handleKeyManualChange = (index: number, value: string) => {
    handleFieldChange(index, { key: normalizeSchemaKey(value) });
  };

  const handleInsertToken = (token: string) => {
    setFormulaExpression((prev) => {
      const cleanPrev = prev.trim();
      if (cleanPrev.length === 0) return token;
      const lastChar = cleanPrev[cleanPrev.length - 1];
      const isOperator = ["+", "-", "*", "/", "(", ")"].includes(token);
      const isLastCharOperator = ["+", "-", "*", "/", "(", ")"].includes(
        lastChar,
      );

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
      }),
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

    // In simulation context, also expose standalone key for single pass simplicity
    if (examMode === "SINGLE_PASS" && simQuestions[0]) {
      Object.keys(simQuestions[0]).forEach((key) => {
        context[key] = simQuestions[0][key];
      });
    }

    return context;
  }, [simQuestions, examMode]);

  const simulationResult = useMemo(() => {
    if (!formulaExpression.trim())
      return { success: false, result: 0, error: "Rumus kosong" };
    try {
      const value = evaluateFormula(formulaExpression, simContext);
      const normalizedValue = Math.max(
        0,
        Math.min(100, Math.round(value * 100) / 100),
      );
      return { success: true, result: normalizedValue, error: null };
    } catch (err: any) {
      return { success: false, result: 0, error: "Rumus tidak valid" };
    }
  }, [formulaExpression, simContext]);

  const handleSimQuestionValueChange = (
    qIndex: number,
    key: string,
    value: number,
  ) => {
    setSimQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIndex]) {
        updated[qIndex] = { ...updated[qIndex], [key]: value };
      }
      return updated;
    });
  };

  const handleSimCounterDelta = (
    qIndex: number,
    key: string,
    delta: number,
    min = 0,
  ) => {
    const curVal = simQuestions[qIndex]?.[key] ?? 0;
    const newVal = Math.max(min, curVal + delta);
    handleSimQuestionValueChange(qIndex, key, newVal);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaUjian.trim()) {
      toast.warning("Nama ujian tidak boleh kosong");
      return;
    }
    if (!formulaExpression.trim()) {
      toast.warning("Rumus penilaian tidak boleh kosong");
      return;
    }

    const invalidField = schemaFields.find(
      (f) => !f.key.trim() || !f.label.trim(),
    );
    if (invalidField) {
      toast.warning("Harap isi semua key dan label kriteria input");
      return;
    }

    const payload = {
      nama_template: namaUjian,
      jenis_ujian: examMode,
      tipe_ujian: tipeUjian,
      filter_jenis_kategori: filterJenisKategori,
      jumlah_soal: jumlahSoal,
      soal_acak_tanpa_detail: soalAcakTanpaDetail,
      formula_expression: formulaExpression,
      aturan_kelulusan: { kkm: 70 },
      input_schema: schemaFields.map(
        ({ key, label, type, min, max, default: def }) => ({
          key,
          label,
          type,
          ...(min !== undefined && { min }),
          ...(max !== undefined && { max }),
          ...(def !== undefined && { default: def }),
        }),
      ),
    };

    createTemplateMutation.mutate(payload as any);
  };

  const handleDeleteTemplate = () => {
    if (selectedTemplate) {
      deleteTemplateMutation.mutate(selectedTemplate.id_template);
    }
  };

  // Calendar Day Generation
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const days: Date[] = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
    }
    return days;
  }, [currentMonth]);

  const handleDayClick = (day: Date) => {
    setJadwalDate(format(day, "yyyy-MM-dd"));
    // Set default start/end period to start & end of current month
    setPeriodeStart(format(startOfMonth(day), "yyyy-MM-dd"));
    setPeriodeEnd(format(endOfMonth(day), "yyyy-MM-dd"));
    setIsJadwalModalOpen(true);
  };

  const handleCreateJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jadwalTitle.trim()) {
      toast.warning("Judul jadwal wajib diisi");
      return;
    }
    if (!jadwalTemplateId) {
      toast.warning("Silakan pilih templat ujian");
      return;
    }

    const payload = {
      id_template: Number(jadwalTemplateId),
      judul_jadwal: jadwalTitle,
      tanggal_ujian: new Date(jadwalDate).toISOString(),
      periode_start: new Date(periodeStart).toISOString(),
      periode_end: new Date(periodeEnd).toISOString(),
      status: jadwalStatus,
      catatan: jadwalNotes,
    };

    createScheduleMutation.mutate(payload);
  };

  const handleScheduleClick = (schedule: ExamSchedule, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSchedule(schedule);
    setJadwalTitle(schedule.judul_jadwal);
    setJadwalTemplateId(schedule.id_template.toString());
    setJadwalDate(format(parseISO(schedule.tanggal_ujian), "yyyy-MM-dd"));
    setPeriodeStart(format(parseISO(schedule.periode_start), "yyyy-MM-dd"));
    setPeriodeEnd(format(parseISO(schedule.periode_end), "yyyy-MM-dd"));
    setJadwalStatus(schedule.status);
    setJadwalNotes(schedule.catatan || "");
    setIsEditJadwalOpen(true);
  };

  const handleUpdateJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return;

    const payload = {
      judul_jadwal: jadwalTitle,
      id_template: Number(jadwalTemplateId),
      tanggal_ujian: new Date(jadwalDate).toISOString(),
      periode_start: new Date(periodeStart).toISOString(),
      periode_end: new Date(periodeEnd).toISOString(),
      status: jadwalStatus,
      catatan: jadwalNotes,
    };

    updateScheduleMutation.mutate({ id: selectedSchedule.id_jadwal, payload });
  };

  const handleDeleteJadwal = () => {
    if (selectedSchedule) {
      deleteScheduleMutation.mutate(selectedSchedule.id_jadwal);
    }
  };

  const handleLockSnapshot = () => {
    if (selectedSchedule) {
      lockSnapshotMutation.mutate(selectedSchedule.id_jadwal);
    }
  };

  const getTemplateDisplayName = (template: ExamTemplate) =>
    template.nama_template?.trim() ||
    template.nama_ujian?.trim() ||
    "Templat tanpa nama";

  // Render Full-Page Create/Edit Form View for Template
  if (isCreating) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
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
            <h1 className="text-xl font-bold tracking-tight">
              Tambah Templat Ujian
            </h1>
            <p className="text-xs text-muted-foreground">
              Konfigurasi kriteria, kalkulator formula nilai, dan simulator
              ujian
            </p>
          </div>
        </div>

        <form
          onSubmit={handleCreateTemplate}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Informasi Utama Ujian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preset Cepat */}
                <div className="space-y-2 border-b pb-4">
                  <Label className="text-xs font-bold text-primary flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" /> Preset Template Ujian
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applyPresetPekanan}
                      className="font-bold flex items-center gap-1 text-xs hover:bg-primary/5 hover:border-primary transition-all"
                    >
                      <CalendarIcon className="h-3.5 w-3.5" /> Ujian Pekanan
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applyPresetBulanan}
                      className="font-bold flex items-center gap-1 text-xs hover:bg-emerald-500/5 hover:border-emerald-500 hover:text-emerald-700 transition-all"
                    >
                      <BookOpen className="h-3.5 w-3.5" /> Ujian Bulanan
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam-name" className="text-xs font-semibold">
                    Nama Ujian / Templat
                  </Label>
                  <Input
                    id="exam-name"
                    placeholder="Contoh: Ujian Pekanan Baru"
                    value={namaUjian}
                    onChange={(e) => setNamaUjian(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipe-ujian" className="text-xs font-semibold">
                      Tipe Ujian
                    </Label>
                    <Select
                      value={tipeUjian}
                      onValueChange={(val: any) => setTipeUjian(val)}
                    >
                      <SelectTrigger id="tipe-ujian" className="h-10 text-xs">
                        <SelectValue placeholder="Pilih Tipe Ujian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PEKANAN">Ujian Pekanan</SelectItem>
                        <SelectItem value="BULANAN">Ujian Bulanan</SelectItem>
                        <SelectItem value="HARIAN">Ujian Harian</SelectItem>
                        <SelectItem value="KUSTOM">Kustom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soal-acak" className="text-xs font-semibold">
                      Soal Acak (Bulanan)
                    </Label>
                    <Select
                      value={soalAcakTanpaDetail ? "true" : "false"}
                      onValueChange={(val: any) => setSoalAcakTanpaDetail(val === "true")}
                    >
                      <SelectTrigger id="soal-acak" className="h-10 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Tidak (Input Detail)</SelectItem>
                        <SelectItem value="true">Ya (Acak / Penilaian Saja)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">
                    Filter Kategori Setoran Terhitung
                  </Label>
                  <div className="flex flex-wrap gap-3 p-3 bg-muted/20 border rounded-lg">
                    {["ZIYADAH", "TASMI", "BACAAN", "MURAJAAH", "LAINNYA"].map((kat) => {
                      const checked = filterJenisKategori.includes(kat);
                      return (
                        <label key={kat} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilterJenisKategori([...filterJenisKategori, kat]);
                              } else {
                                setFilterJenisKategori(filterJenisKategori.filter((x) => x !== kat));
                              }
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          {kat}
                        </label>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    Kategori setoran yang dicentang akan dihitung masuk ke snapshot. Kosongkan untuk menghitung semua kategori.
                  </span>
                </div>

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
                        Soal diinput per butir. Cocok untuk{" "}
                        <strong>Ujian Pekanan</strong>.
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
                        Satu penilaian global. Cocok untuk{" "}
                        <strong>Ujian Bulanan</strong>.
                      </span>
                    </button>
                  </div>
                </div>

                {examMode === "MULTI_SOAL" && (
                  <div className="space-y-2">
                    <Label htmlFor="exam-qty" className="text-xs font-semibold">
                      Jumlah Soal Uji
                    </Label>
                    <Input
                      id="exam-qty"
                      type="number"
                      min={1}
                      max={10}
                      value={jumlahSoal}
                      onChange={(e) =>
                        setJumlahSoal(Math.max(1, Number(e.target.value)))
                      }
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Kriteria Input Penilaian
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSchemaField}
                  className="h-7 text-[10px] font-bold gap-1"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-primary" />
                  Tambah Field
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {schemaFields.map((field, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2.5 items-end bg-muted/20 p-3 rounded-lg border relative group"
                    >
                      <div className="grid grid-cols-12 gap-2 w-full">
                        <div className="col-span-5 space-y-1">
                          <Label className="text-[10px] font-bold text-muted-foreground">
                            Label Input
                          </Label>
                          <Input
                            placeholder="Label (Contoh: Salah Jali)"
                            value={field.label}
                            onChange={(e) =>
                              handleLabelChange(idx, e.target.value)
                            }
                            required
                            className="h-8 text-xs font-semibold"
                          />
                        </div>
                        <div className="col-span-4 space-y-1">
                          <Label className="text-[10px] font-bold text-muted-foreground flex items-center justify-between">
                            Key Variabel
                            <button
                              type="button"
                              onClick={() => handleToggleKeyLock(idx)}
                              className="text-muted-foreground hover:text-primary transition"
                              title={
                                field.isKeyUnlocked
                                  ? "Kunci Otomatis"
                                  : "Edit Manual"
                              }
                            >
                              {field.isKeyUnlocked ? (
                                <Unlock className="h-3 w-3 text-primary" />
                              ) : (
                                <Lock className="h-3 w-3" />
                              )}
                            </button>
                          </Label>
                          <Input
                            placeholder="key_variabel"
                            value={field.key}
                            onChange={(e) =>
                              handleKeyManualChange(idx, e.target.value)
                            }
                            disabled={!field.isKeyUnlocked}
                            required
                            className="h-8 text-xs font-mono font-semibold"
                          />
                        </div>
                        <div className="col-span-3 space-y-1">
                          <Label className="text-[10px] font-bold text-muted-foreground">
                            Tipe UI
                          </Label>
                          <Select
                            value={field.type}
                            onValueChange={(val: any) =>
                              handleFieldChange(idx, { type: val })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Pilih Tipe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COUNTER">
                                Counter (+/-)
                              </SelectItem>
                              <SelectItem value="SLIDER">Slider</SelectItem>
                              <SelectItem value="NUMBER">
                                Number Input
                              </SelectItem>
                              <SelectItem value="TEXTAREA">Textarea</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSchemaField(idx)}
                        disabled={schemaFields.length <= 1}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
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

                  <div className="border border-dashed rounded-lg p-3 bg-muted/20 mt-3 space-y-2">
                    <span className="text-[9px] font-bold text-muted-foreground block uppercase tracking-wider">
                      Klik lencana untuk memasukkan token:
                    </span>
                    <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                      {examMode === "SINGLE_PASS" ? (
                        <div className="space-y-1">
                          <span className="text-[8px] font-extrabold text-primary font-mono uppercase block">
                            » Variabel Input:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {schemaFields
                              .filter((f) => f.key && f.type !== "TEXTAREA")
                              .map((f) => (
                                <Badge
                                  key={f.key}
                                  onClick={() => handleInsertToken(f.key)}
                                  className="cursor-pointer font-mono text-[9px] px-1.5 py-0.5 rounded"
                                  variant="secondary"
                                >
                                  {f.key}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      ) : (
                        schemaFields
                          .filter((f) => f.key && f.type !== "TEXTAREA")
                          .map((field) => (
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
                                      onClick={() =>
                                        handleInsertToken(tokenName)
                                      }
                                      className="cursor-pointer font-mono text-[9px] px-1.5 py-0.5 rounded"
                                      variant="secondary"
                                    >
                                      {tokenName}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                      )}
                      {schemaFields.filter(
                        (f) => f.key && f.type !== "TEXTAREA",
                      ).length === 0 && (
                        <span className="text-[9px] text-muted-foreground italic">
                          Belum ada variabel kriteria numerik aktif...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                {schemaFields.filter((f) => f.key && f.type !== "TEXTAREA")
                  .length === 0 ? (
                  <div className="text-center py-6 text-[10px] text-muted-foreground italic">
                    Definisikan kriteria input di sebelah kiri untuk mencoba
                    simulator ujian...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {examMode === "MULTI_SOAL" && (
                      <div className="flex justify-between items-center bg-muted/20 rounded-lg border p-2">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                          Soal Uji #{simActiveQuestionIdx + 1}
                        </span>
                        <div className="flex gap-1.5">
                          {Array.from({ length: jumlahSoal }).map((_, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              variant={
                                simActiveQuestionIdx === idx
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="h-6 w-6 text-[10px] font-bold p-0 rounded"
                              onClick={() => setSimActiveQuestionIdx(idx)}
                            >
                              {idx + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 min-h-[100px] flex flex-col justify-center">
                      {schemaFields
                        .filter(
                          (field) => field.key && field.type !== "TEXTAREA",
                        )
                        .map((field) => {
                          const value =
                            simQuestions[simActiveQuestionIdx]?.[field.key] ??
                            0;

                          if (field.type === "COUNTER") {
                            return (
                              <div
                                key={field.key}
                                className="flex justify-between items-center gap-4 bg-muted/10 p-2 rounded-lg border"
                              >
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                  {field.label}
                                </span>
                                <div className="flex items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-7 w-7 rounded p-0"
                                    onClick={() =>
                                      handleSimCounterDelta(
                                        simActiveQuestionIdx,
                                        field.key,
                                        -1,
                                        field.min,
                                      )
                                    }
                                  >
                                    <MinusIcon className="h-3 w-3" />
                                  </Button>
                                  <span className="text-xs font-black w-6 text-center">
                                    {value}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-7 w-7 rounded p-0"
                                    onClick={() =>
                                      handleSimCounterDelta(
                                        simActiveQuestionIdx,
                                        field.key,
                                        1,
                                        field.min,
                                      )
                                    }
                                  >
                                    <PlusIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }

                          if (field.type === "SLIDER") {
                            return (
                              <div
                                key={field.key}
                                className="space-y-1 bg-muted/10 p-2 rounded-lg border"
                              >
                                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                                  <span>{field.label}</span>
                                  <span className="font-black text-primary font-mono">
                                    ({value})
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min={field.min ?? 0}
                                  max={field.max ?? 100}
                                  value={value}
                                  onChange={(e) =>
                                    handleSimQuestionValueChange(
                                      simActiveQuestionIdx,
                                      field.key,
                                      Number(e.target.value),
                                    )
                                  }
                                  className="w-full accent-primary h-1 bg-muted rounded appearance-none cursor-pointer mt-1"
                                />
                              </div>
                            );
                          }

                          if (field.type === "NUMBER") {
                            return (
                              <div
                                key={field.key}
                                className="space-y-1 bg-muted/10 p-2 rounded-lg border"
                              >
                                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                                  <span>{field.label}</span>
                                </div>
                                <Input
                                  type="number"
                                  min={field.min ?? 0}
                                  max={field.max ?? 100}
                                  value={value}
                                  onChange={(e) =>
                                    handleSimQuestionValueChange(
                                      simActiveQuestionIdx,
                                      field.key,
                                      Number(e.target.value),
                                    )
                                  }
                                  className="h-8.5 text-xs font-bold text-center mt-1 bg-background"
                                />
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-dashed">
                      <div className="bg-muted/10 rounded-lg p-2.5 text-center flex flex-col justify-center items-center shadow-sm border">
                        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
                          Variabel Kesalahan
                        </span>
                        <span className="text-sm font-extrabold text-destructive mt-0.5">
                          {simContext.total_salah_jali ||
                            simContext.jumlah_kesalahan ||
                            0}
                        </span>
                      </div>

                      <div className="bg-muted/10 rounded-lg p-2.5 text-center flex flex-col justify-center items-center shadow-sm border">
                        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
                          Simulasi Nilai
                        </span>
                        <span className="text-base font-black text-primary mt-0.5">
                          {simulationResult.success
                            ? simulationResult.result
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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
              disabled={
                createTemplateMutation.isPending || !simulationResult.success
              }
              className="h-10 px-8 text-xs font-bold"
            >
              {createTemplateMutation.isPending
                ? "Menyimpan..."
                : "Simpan Templat"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Render Table List Page View (Default)
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-5 gap-4">
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
              Kelola Pelaksanaan Ujian
            </h1>
            <p className="text-xs text-muted-foreground">
              Desain kriteria ujian dan jadwalkan pelaksanaan ujian tahfiz
              secara dinamis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-lg border">
          <Button
            variant={activeTab === "templates" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("templates")}
            className="text-xs font-bold h-8"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Templat Ujian
          </Button>
          <Button
            variant={activeTab === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("calendar")}
            className="text-xs font-bold h-8"
          >
            <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
            Kalender Jadwal
          </Button>
        </div>
      </div>

      {activeTab === "templates" ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-foreground">
              Daftar Templat Penilaian
            </h2>
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

          <Alert className="bg-muted/30 border">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-xs font-bold uppercase tracking-wider text-primary">
              Grading Engine
            </AlertTitle>
            <AlertDescription className="text-xs leading-relaxed mt-1">
              Sistem penilaian otomatis mengevaluasi rumus yang dibuat
              berdasarkan data input ujian. Anda dapat menggunakan rumus
              matematika umum dan menunjuk variabel kriteria menggunakan token.
            </AlertDescription>
          </Alert>

          <Card className="shadow-sm">
            <CardHeader className="py-4 px-6 border-b">
              <CardTitle className="text-sm font-bold">
                Templat Ujian Aktif
              </CardTitle>
              <CardDescription className="text-xs">
                Daftar opsi ujian kustom yang saat ini terintegrasi di sistem
                sekolah Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingTemplates ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  Memuat templat...
                </div>
              ) : errorTemplates ? (
                <div className="p-10 text-center text-sm text-destructive font-medium">
                  Gagal memuat templat: {errorTemplates.message}
                </div>
              ) : templates.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground space-y-2">
                  <GraduationCap className="h-8 w-8 mx-auto opacity-30 text-muted-foreground" />
                  <p className="font-medium">Belum ada templat ujian kustom</p>
                  <p className="text-xs">
                    Klik tombol &quot;Tambah Templat&quot; di atas untuk
                    membuat.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-1/4 font-semibold text-xs">
                        Nama Ujian
                      </TableHead>
                      <TableHead className="w-[120px] font-semibold text-xs text-center">
                        Mode
                      </TableHead>
                      <TableHead className="font-semibold text-xs">
                        Kriteria Input
                      </TableHead>
                      <TableHead className="w-[200px] font-semibold text-xs">
                        Rumus Penilaian
                      </TableHead>
                      <TableHead className="w-[100px] font-semibold text-xs text-right pr-6">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((temp) => (
                      <TableRow
                        key={temp.id_template}
                        className="transition-all hover:bg-muted/10"
                      >
                        <TableCell className="font-bold text-sm text-foreground py-3.5">
                          {temp.nama_template}
                        </TableCell>
                        <TableCell className="text-center py-3.5">
                          {temp.jenis_ujian === "SINGLE_PASS" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 text-[9px] font-bold hover:bg-emerald-500/10">
                              <BookOpen className="h-2.5 w-2.5 mr-1 inline" />
                              Single Pass
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-[9px] font-bold"
                            >
                              <ListOrdered className="h-2.5 w-2.5 mr-1 inline" />
                              Multi Soal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5 flex flex-wrap gap-1 max-w-[250px]">
                          {temp.input_schema?.map((f) => (
                            <Badge
                              key={f.key}
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0"
                            >
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
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-base font-extrabold text-foreground min-w-[140px] text-center capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: idLocale })}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              {isLoadingSchedules
                ? "Memuat jadwal ujian..."
                : "* Klik sel tanggal di kalender untuk menjadwalkan ujian baru"}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-muted-foreground pb-2 border-b">
            <div>Senin</div>
            <div>Selasa</div>
            <div>Rabu</div>
            <div>Kamis</div>
            <div>Jumat</div>
            <div>Sabtu</div>
            <div>Minggu</div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 min-h-[480px]">
            {calendarDays.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const daySchedules = schedules.filter((s) => {
                const sDate = parseISO(s.tanggal_ujian);
                return isSameDay(day, sDate);
              });

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={`border rounded-lg p-2 flex flex-col justify-between cursor-pointer transition-all hover:bg-muted/10 min-h-[85px] group ${
                    isCurrentMonth
                      ? "bg-card"
                      : "bg-muted/20 text-muted-foreground opacity-60"
                  } ${isToday ? "ring-2 ring-primary border-transparent" : "border-border"}`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[10px] font-black ${isToday ? "text-primary font-black" : ""}`}
                    >
                      {format(day, "d")}
                    </span>
                    {daySchedules.length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1.5 overflow-hidden flex-1 flex flex-col justify-end">
                    {daySchedules.slice(0, 2).map((sched) => {
                      let statusBadge =
                        "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200";
                      if (sched.status === "AKTIF")
                        statusBadge =
                          "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200";
                      if (sched.status === "SELESAI")
                        statusBadge =
                          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200";
                      if (sched.status === "DIBATALKAN")
                        statusBadge =
                          "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200";

                      return (
                        <div
                          key={sched.id_jadwal}
                          onClick={(e) => handleScheduleClick(sched, e)}
                          className={`text-[8px] font-bold px-1.5 py-0.5 rounded border leading-tight truncate text-left cursor-pointer hover:opacity-85 ${statusBadge}`}
                          title={`${sched.judul_jadwal} (${sched.status})`}
                        >
                          {sched.judul_jadwal}
                        </div>
                      );
                    })}
                    {daySchedules.length > 2 && (
                      <div className="text-[7px] text-muted-foreground text-center font-extrabold">
                        +{daySchedules.length - 2} Lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE JADWAL MODAL */}
      <Dialog open={isJadwalModalOpen} onOpenChange={setIsJadwalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-extrabold flex items-center gap-2">
              <CalendarIcon className="h-4.5 w-4.5 text-primary" />
              Jadwalkan Ujian Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat rincian pelaksanaan ujian berdasarkan templat yang telah
              didesain.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateJadwal} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Judul Pelaksanaan Ujian
              </Label>
              <Input
                placeholder="Contoh: Ujian Akhir Bulan Juli 2026"
                value={jadwalTitle}
                onChange={(e) => setJadwalTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Pilih Templat Penilaian
              </Label>
              <Select
                value={jadwalTemplateId}
                onValueChange={setJadwalTemplateId}
                required
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Pilih Templat Ujian" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem
                      key={t.id_template}
                      value={t.id_template.toString()}
                    >
                      {getTemplateDisplayName(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Tanggal Ujian</Label>
                <Input
                  type="date"
                  value={jadwalDate}
                  onChange={(e) => setJadwalDate(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Periode Awal</Label>
                <Input
                  type="date"
                  value={periodeStart}
                  onChange={(e) => setPeriodeStart(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Periode Akhir</Label>
                <Input
                  type="date"
                  value={periodeEnd}
                  onChange={(e) => setPeriodeEnd(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-semibold">Status Awal</Label>
                <Select
                  value={jadwalStatus}
                  onValueChange={(val: any) => setJadwalStatus(val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      Draft (Belum bisa dipilih Muhafidz)
                    </SelectItem>
                    <SelectItem value="AKTIF">
                      Aktif (Dapat dipilih Muhafidz)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Catatan Tambahan (Opsional)
              </Label>
              <Textarea
                placeholder="Rincian / Petunjuk Ujian..."
                value={jadwalNotes}
                onChange={(e) => setJadwalNotes(e.target.value)}
                className="text-xs min-h-[70px] resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsJadwalModalOpen(false);
                  clearJadwalForm();
                }}
                className="h-9 text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createScheduleMutation.isPending}
                className="h-9 text-xs font-bold"
              >
                {createScheduleMutation.isPending
                  ? "Menyimpan..."
                  : "Simpan Jadwal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT / DETAIL JADWAL MODAL */}
      <Dialog open={isEditJadwalOpen} onOpenChange={setIsEditJadwalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-extrabold flex items-center justify-between">
              <span>Detail Pelaksanaan Ujian</span>
              <Badge
                className={`text-[9px] font-black uppercase ${
                  jadwalStatus === "AKTIF"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200"
                    : jadwalStatus === "SELESAI"
                      ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200"
                      : jadwalStatus === "DIBATALKAN"
                        ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200"
                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200"
                }`}
              >
                {jadwalStatus}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateJadwal} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Judul Jadwal</Label>
              <Input
                value={jadwalTitle}
                onChange={(e) => setJadwalTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Pilih Templat Penilaian
              </Label>
              <Select
                value={jadwalTemplateId}
                onValueChange={setJadwalTemplateId}
                required
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Pilih Templat Ujian" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem
                      key={t.id_template}
                      value={t.id_template.toString()}
                    >
                      {getTemplateDisplayName(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Tanggal Ujian</Label>
                <Input
                  type="date"
                  value={jadwalDate}
                  onChange={(e) => setJadwalDate(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Periode Awal</Label>
                <Input
                  type="date"
                  value={periodeStart}
                  onChange={(e) => setPeriodeStart(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Periode Akhir</Label>
                <Input
                  type="date"
                  value={periodeEnd}
                  onChange={(e) => setPeriodeEnd(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-semibold">Ubah Status</Label>
                <Select
                  value={jadwalStatus}
                  onValueChange={(val: any) => setJadwalStatus(val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      Draft (Belum bisa dipilih Muhafidz)
                    </SelectItem>
                    <SelectItem value="AKTIF">
                      Aktif (Dapat dipilih Muhafidz)
                    </SelectItem>
                    <SelectItem value="SELESAI">
                      Selesai (Tidak menerima input hasil baru)
                    </SelectItem>
                    <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Catatan</Label>
              <Textarea
                value={jadwalNotes}
                onChange={(e) => setJadwalNotes(e.target.value)}
                className="text-xs min-h-[70px] resize-none"
              />
            </div>

            {/* Locked Snapshot Feature Action */}
            <div className="bg-muted/30 border border-dashed rounded-lg p-3 flex items-center justify-between gap-4 mt-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-foreground block">
                  Snapshot Materi Hafalan
                </span>
                <span className="text-[9px] text-muted-foreground block leading-normal">
                  Kunci rentang ayat & statistik setoran santri untuk periode
                  ini sekarang.
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLockSnapshot}
                disabled={lockSnapshotMutation.isPending}
                className="h-7.5 px-3 text-[10px] font-black text-primary gap-1 border-primary/20 hover:border-primary/40 shrink-0"
              >
                <Lock className="h-3 w-3" />
                Kunci
              </Button>
            </div>

            <DialogFooter className="pt-2 flex justify-between items-center gap-2 w-full">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDeleteJadwal}
                disabled={deleteScheduleMutation.isPending}
                className="h-9 text-xs font-bold text-destructive hover:bg-destructive/10 mr-auto"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditJadwalOpen(false);
                    setSelectedSchedule(null);
                  }}
                  className="h-9 text-xs font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={updateScheduleMutation.isPending}
                  className="h-9 text-xs font-bold"
                >
                  {updateScheduleMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION DELETE TEMPLATE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus templat ujian{" "}
              <strong>{selectedTemplate?.nama_template}</strong>? Tindakan ini
              tidak dapat dibatalkan.
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
              onClick={handleDeleteTemplate}
              disabled={deleteTemplateMutation.isPending}
              className="h-9.5 font-semibold text-xs"
            >
              {deleteTemplateMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
