import {
  ChevronLeft,
  Plus,
  GraduationCap,
  AlertCircle,
  Calendar as CalendarIcon,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useUjianSettings,
  ExamTemplateTable,
  ExamCalendar,
  ExamTemplateForm,
  JadwalDialogs,
  DeleteTemplateDialog,
} from "../modules";

export default function UjianSettingsPage() {
  const {
    navigate,
    activeTab,
    setActiveTab,
    isCreating,
    setIsCreating,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedTemplate,
    tipeUjian,
    setTipeUjian,
    filterJenisKategori,
    setFilterJenisKategori,
    soalAcakTanpaDetail,
    setSoalAcakTanpaDetail,
    namaUjian,
    setNamaUjian,
    examMode,
    jumlahSoal,
    setJumlahSoal,
    formulaExpression,
    setFormulaExpression,
    schemaFields,
    simQuestions,
    simActiveQuestionIdx,
    setSimActiveQuestionIdx,
    currentMonth,
    setCurrentMonth,
    isJadwalModalOpen,
    setIsJadwalModalOpen,
    isEditJadwalOpen,
    setIsEditJadwalOpen,
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
    isCreatingTemplate,
    isDeletingTemplate,
    isCreatingSchedule,
    isUpdatingSchedule,
    isDeletingSchedule,
    isLockingSnapshot,
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
  } = useUjianSettings();

  // Render Full-Page Create/Edit Form View for Template
  if (isCreating) {
    return (
      <ExamTemplateForm
        resetForm={resetForm}
        setIsCreating={setIsCreating}
        applyPresetPekanan={applyPresetPekanan}
        applyPresetBulanan={applyPresetBulanan}
        namaUjian={namaUjian}
        setNamaUjian={setNamaUjian}
        tipeUjian={tipeUjian}
        setTipeUjian={setTipeUjian}
        soalAcakTanpaDetail={soalAcakTanpaDetail}
        setSoalAcakTanpaDetail={setSoalAcakTanpaDetail}
        filterJenisKategori={filterJenisKategori}
        setFilterJenisKategori={setFilterJenisKategori}
        examMode={examMode}
        handleExamModeChange={handleExamModeChange}
        jumlahSoal={jumlahSoal}
        setJumlahSoal={setJumlahSoal}
        handleAddSchemaField={handleAddSchemaField}
        schemaFields={schemaFields}
        handleLabelChange={handleLabelChange}
        handleToggleKeyLock={handleToggleKeyLock}
        handleKeyManualChange={handleKeyManualChange}
        handleFieldChange={handleFieldChange}
        handleRemoveSchemaField={handleRemoveSchemaField}
        formulaExpression={formulaExpression}
        setFormulaExpression={setFormulaExpression}
        handleInsertToken={handleInsertToken}
        simQuestions={simQuestions}
        simActiveQuestionIdx={simActiveQuestionIdx}
        setSimActiveQuestionIdx={setSimActiveQuestionIdx}
        simContext={simContext}
        simulationResult={simulationResult}
        handleSimCounterDelta={handleSimCounterDelta}
        handleSimQuestionValueChange={handleSimQuestionValueChange}
        handleCreateTemplate={handleCreateTemplate}
        isCreatingTemplate={isCreatingTemplate}
      />
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
              Desain kriteria ujian dan jadwalkan pelaksanaan ujian tahfiz secara dinamis
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
              Sistem penilaian otomatis mengevaluasi rumus yang dibuat berdasarkan data input ujian.
              Anda dapat menggunakan rumus matematika umum dan menunjuk variabel kriteria menggunakan token.
            </AlertDescription>
          </Alert>

          <ExamTemplateTable
            templates={templates}
            isLoadingTemplates={isLoadingTemplates}
            errorTemplates={errorTemplates}
            handleOpenDelete={handleOpenDelete}
          />
        </>
      ) : (
        <ExamCalendar
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          isLoadingSchedules={isLoadingSchedules}
          schedules={schedules}
          calendarDays={calendarDays}
          handleDayClick={handleDayClick}
          handleScheduleClick={handleScheduleClick}
        />
      )}

      {/* JADWAL DIALOGS (CREATE & EDIT) */}
      <JadwalDialogs
        isJadwalModalOpen={isJadwalModalOpen}
        setIsJadwalModalOpen={setIsJadwalModalOpen}
        isEditJadwalOpen={isEditJadwalOpen}
        setIsEditJadwalOpen={setIsEditJadwalOpen}
        jadwalTitle={jadwalTitle}
        setJadwalTitle={setJadwalTitle}
        jadwalTemplateId={jadwalTemplateId}
        setJadwalTemplateId={setJadwalTemplateId}
        jadwalDate={jadwalDate}
        setJadwalDate={setJadwalDate}
        periodeStart={periodeStart}
        setPeriodeStart={setPeriodeStart}
        periodeEnd={periodeEnd}
        setPeriodeEnd={setPeriodeEnd}
        jadwalStatus={jadwalStatus}
        setJadwalStatus={setJadwalStatus}
        jadwalNotes={jadwalNotes}
        setJadwalNotes={setJadwalNotes}
        templates={templates}
        isCreatingSchedule={isCreatingSchedule}
        isUpdatingSchedule={isUpdatingSchedule}
        isDeletingSchedule={isDeletingSchedule}
        isLockingSnapshot={isLockingSnapshot}
        handleCreateJadwal={handleCreateJadwal}
        handleUpdateJadwal={handleUpdateJadwal}
        handleDeleteJadwal={handleDeleteJadwal}
        handleLockSnapshot={handleLockSnapshot}
        getTemplateDisplayName={getTemplateDisplayName}
        clearJadwalForm={clearJadwalForm}
      />

      {/* CONFIRMATION DELETE TEMPLATE MODAL */}
      <DeleteTemplateDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        selectedTemplate={selectedTemplate}
        handleDeleteTemplate={handleDeleteTemplate}
        isDeletingTemplate={isDeletingTemplate}
      />
    </div>
  );
}
