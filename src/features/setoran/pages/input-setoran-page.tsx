"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSetoran } from "../hooks/useSetoran";
import { SetoranForm } from "../components/SetoranForm";
import { Setoran } from "@/components/custom/typed-text";
import { AlertCircle, FileText, ClipboardList, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicExamForm } from "../components/DynamicExamForm";
import { type FormMode } from "../hooks/useSmartSetoranMode";
import { ModeBadge } from "../components/SetoranModeBanner";

export function InputSetoranPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { santriList, sesiList, loading, fetchSantri, addSetoran } = useSetoran();
  const [isFormValid, setIsFormValid] = useState(true);
  const [activeTab, setActiveTab] = useState<"setoran" | "ujian">("setoran");
  // Track mode dari SetoranForm agar tombol submit di luar bisa reflect mode
  const [formMode, setFormMode] = useState<FormMode>("idle");
  const [isFormChecking, setIsFormChecking] = useState(false);

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  const isEditMode = formMode === "edit";
  const isIdle = formMode === "idle";

  const submitButtonLabel = () => {
    if (loading) return isEditMode ? "Memperbarui..." : "Menyimpan...";
    if (isFormChecking) return "Memeriksa...";
    return isEditMode ? "Perbarui Setoran" : "Simpan Setoran";
  };

  const SubmitIcon = isEditMode ? RefreshCw : Save;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
          <div className="space-y-1">
            <Setoran />
          </div>
        </div>
      )}

      {/* Navigasi Tab */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        <Button
          variant={activeTab === "setoran" ? "default" : "outline"}
          onClick={() => setActiveTab("setoran")}
          className="font-bold flex items-center gap-2 h-10 shadow-sm"
        >
          <ClipboardList className="h-4 w-4" />
          Setoran Harian
        </Button>
        <Button
          variant={activeTab === "ujian" ? "default" : "outline"}
          onClick={() => setActiveTab("ujian")}
          className="font-bold flex items-center gap-2 h-10 shadow-sm"
        >
          <FileText className="h-4 w-4" />
          Ujian Tahfiz
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {activeTab === "setoran" ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle>Form Setoran</CardTitle>
                  <ModeBadge mode={formMode} />
                </div>
                <CardDescription>
                  {isEditMode
                    ? "Data setoran yang sudah ada telah dimuat. Lakukan perubahan yang diperlukan, lalu klik Perbarui."
                    : <>
                        Masukkan detail hafalan santri terbaru. Gunakan tombol{" "}
                        <span className="font-medium text-foreground">Pilih dari Mushaf</span>{" "}
                        untuk memilih ayat langsung dari tampilan mushaf interaktif.
                      </>
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SetoranForm
                  santriList={santriList}
                  sesiList={sesiList}
                  onSubmit={addSetoran}
                  onValidationChange={setIsFormValid}
                  onModeChange={setFormMode}
                  onCheckingChange={setIsFormChecking}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
              <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  {isEditMode
                    ? "Mode edit aktif. Perubahan akan diterapkan pada data setoran yang sudah ada."
                    : "Daftar santri yang muncul hanya yang terdaftar di halaqah Anda. Pastikan data juz dan surah sudah benar sebelum menyimpan."}
                </p>
              </div>
              <Button
                type="submit"
                form="setoran-form"
                disabled={loading || isFormChecking || santriList.length === 0 || !isFormValid || isIdle}
                className={[
                  "w-full md:w-auto px-12 h-11 font-bold shadow-lg gap-2",
                  isEditMode ? "shadow-amber-500/20" : "shadow-primary/20",
                ].join(" ")}
                variant={isEditMode ? "outline" : "default"}
              >
                <SubmitIcon className="h-4 w-4" />
                {submitButtonLabel()}
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Evaluasi &amp; Ujian Tahfiz</CardTitle>
              <CardDescription>
                Form penilaian ujian santri tahfiz berdasarkan jadwal pelaksanaan aktif.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicExamForm
                santriList={santriList}
                sesiList={sesiList}
                onSuccess={() => {
                  setActiveTab("setoran");
                  fetchSantri();
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
