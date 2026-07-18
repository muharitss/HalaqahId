import {
  ChevronLeft,
  GraduationCap,
  Calendar as CalendarIcon,
  BookOpen,
  ListOrdered,
  PlusCircle,
  Unlock,
  Lock,
  X,
  Play,
  CheckCircle,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import type { SchemaField } from "../utils/evaluateFormula";

interface ExamTemplateFormProps {
  resetForm: () => void;
  setIsCreating: (val: boolean) => void;
  applyPresetPekanan: () => void;
  applyPresetBulanan: () => void;
  namaUjian: string;
  setNamaUjian: (val: string) => void;
  tipeUjian: "PEKANAN" | "BULANAN" | "HARIAN" | "KUSTOM";
  setTipeUjian: (val: "PEKANAN" | "BULANAN" | "HARIAN" | "KUSTOM") => void;
  soalAcakTanpaDetail: boolean;
  setSoalAcakTanpaDetail: (val: boolean) => void;
  filterJenisKategori: string[];
  setFilterJenisKategori: (val: string[]) => void;
  examMode: "MULTI_SOAL" | "SINGLE_PASS";
  handleExamModeChange: (val: "MULTI_SOAL" | "SINGLE_PASS") => void;
  jumlahSoal: number;
  setJumlahSoal: (val: number) => void;
  handleAddSchemaField: () => void;
  schemaFields: SchemaField[];
  handleLabelChange: (index: number, label: string) => void;
  handleToggleKeyLock: (index: number) => void;
  handleKeyManualChange: (index: number, val: string) => void;
  handleFieldChange: (index: number, val: any) => void;
  handleRemoveSchemaField: (index: number) => void;
  formulaExpression: string;
  setFormulaExpression: (val: string | ((prev: string) => string)) => void;
  handleInsertToken: (token: string) => void;
  simQuestions: any[];
  simActiveQuestionIdx: number;
  setSimActiveQuestionIdx: (val: number) => void;
  simContext: any;
  simulationResult: any;
  handleSimCounterDelta: (idx: number, key: string, delta: number, min?: number) => void;
  handleSimQuestionValueChange: (idx: number, key: string, val: number) => void;
  handleCreateTemplate: (e: React.FormEvent) => void;
  isCreatingTemplate: boolean;
}

export function ExamTemplateForm({
  resetForm,
  setIsCreating,
  applyPresetPekanan,
  applyPresetBulanan,
  namaUjian,
  setNamaUjian,
  tipeUjian,
  setTipeUjian,
  soalAcakTanpaDetail,
  setSoalAcakTanpaDetail,
  filterJenisKategori,
  setFilterJenisKategori,
  examMode,
  handleExamModeChange,
  jumlahSoal,
  setJumlahSoal,
  handleAddSchemaField,
  schemaFields,
  handleLabelChange,
  handleToggleKeyLock,
  handleKeyManualChange,
  handleFieldChange,
  handleRemoveSchemaField,
  formulaExpression,
  setFormulaExpression,
  handleInsertToken,
  simQuestions,
  simActiveQuestionIdx,
  setSimActiveQuestionIdx,
  simContext,
  simulationResult,
  handleSimCounterDelta,
  handleSimQuestionValueChange,
  handleCreateTemplate,
  isCreatingTemplate,
}: ExamTemplateFormProps) {
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
            Konfigurasi kriteria, kalkulator formula nilai, dan simulator ujian
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
                          Â» Variabel Input:
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
                              Â» {field.label}:
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
                        ))
                    )}
                    {schemaFields.filter((f) => f.key && f.type !== "TEXTAREA").length === 0 && (
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
                  âš ï¸ {simulationResult.error}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {schemaFields.filter((f) => f.key && f.type !== "TEXTAREA").length === 0 ? (
                <div className="text-center py-6 text-[10px] text-muted-foreground italic">
                  Definisikan kriteria input di sebelah kiri untuk mencoba simulator ujian...
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
                  )}

                  <div className="space-y-3 min-h-[100px] flex flex-col justify-center">
                    {schemaFields
                      .filter((field) => field.key && field.type !== "TEXTAREA")
                      .map((field) => {
                        const value = simQuestions[simActiveQuestionIdx]?.[field.key] ?? 0;

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
                        {simContext.total_salah_jali || simContext.jumlah_kesalahan || 0}
                      </span>
                    </div>

                    <div className="bg-muted/10 rounded-lg p-2.5 text-center flex flex-col justify-center items-center shadow-sm border">
                      <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
                        Simulasi Nilai
                      </span>
                      <span className="text-base font-black text-primary mt-0.5">
                        {simulationResult.success ? simulationResult.result : "â€”"}
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
            disabled={isCreatingTemplate || !simulationResult.success}
            className="h-10 px-8 text-xs font-bold"
          >
            {isCreatingTemplate ? "Menyimpan..." : "Simpan Templat"}
          </Button>
        </div>
      </form>
    </div>
  );
}

