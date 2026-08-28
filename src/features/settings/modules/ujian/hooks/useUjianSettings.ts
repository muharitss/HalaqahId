import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ExamTemplate,
  type ExamSchedule,
  type ExamMode,
  ujianService,
} from "@/features/setoran/api/ujian-api";
import { toast } from "sonner";
import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { evaluateFormula, type SchemaField } from "../utils/evaluateFormula";

export type { SchemaField };

export function useUjianSettings() {
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
  const [tipeUjian, setTipeUjianState] = useState<"PEKANAN" | "BULANAN" | "HARIAN" | "KUSTOM">("KUSTOM");
  const [filterJenisKategori, setFilterJenisKategori] = useState<string[]>([]);
  const [soalAcakTanpaDetail, setSoalAcakTanpaDetail] = useState(false);

  const setTipeUjian = (val: "PEKANAN" | "BULANAN" | "HARIAN" | "KUSTOM") => {
    setTipeUjianState(val);
    if (val === "BULANAN") {
      setSoalAcakTanpaDetail(true);
    }
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

  return {
    navigate,
    activeTab,
    setActiveTab,
    isCreating,
    setIsCreating,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedTemplate,
    setSelectedTemplate,
    tipeUjian,
    setTipeUjian,
    filterJenisKategori,
    setFilterJenisKategori,
    soalAcakTanpaDetail,
    setSoalAcakTanpaDetail,
    namaUjian,
    setNamaUjian,
    examMode,
    setExamMode,
    jumlahSoal,
    setJumlahSoal,
    formulaExpression,
    setFormulaExpression,
    schemaFields,
    setSchemaFields,
    simQuestions,
    setSimQuestions,
    simActiveQuestionIdx,
    setSimActiveQuestionIdx,
    currentMonth,
    setCurrentMonth,
    isJadwalModalOpen,
    setIsJadwalModalOpen,
    isEditJadwalOpen,
    setIsEditJadwalOpen,
    selectedSchedule,
    setSelectedSchedule,
    jadwalTitle,
    setJadwalTitle,
    jadwalTemplateId,
    setJadwalTemplateId,
    jadwalDate,
    setJadwalDate,
    periodeStart,
    setPeriodeStart,
    periodeEnd,
    setPeriodeEnd,
    jadwalStatus,
    setJadwalStatus,
    jadwalNotes,
    setJadwalNotes,
    templates,
    isLoadingTemplates,
    errorTemplates,
    schedules,
    isLoadingSchedules,
    isCreatingTemplate: createTemplateMutation.isPending,
    isDeletingTemplate: deleteTemplateMutation.isPending,
    isCreatingSchedule: createScheduleMutation.isPending,
    isUpdatingSchedule: updateScheduleMutation.isPending,
    isDeletingSchedule: deleteScheduleMutation.isPending,
    isLockingSnapshot: lockSnapshotMutation.isPending,
    applyPresetPekanan,
    applyPresetBulanan,
    resetForm,
    clearJadwalForm,
    handleExamModeChange,
    handleOpenDelete,
    handleAddSchemaField,
    handleRemoveSchemaField,
    handleFieldChange,
    handleLabelChange,
    handleToggleKeyLock,
    handleKeyManualChange,
    handleInsertToken,
    simContext,
    simulationResult,
    handleSimQuestionValueChange,
    handleSimCounterDelta,
    handleCreateTemplate,
    handleDeleteTemplate,
    calendarDays,
    handleDayClick,
    handleCreateJadwal,
    handleScheduleClick,
    handleUpdateJadwal,
    handleDeleteJadwal,
    handleLockSnapshot,
    getTemplateDisplayName,
  };
}
