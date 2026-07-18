"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, ClipboardList, Save, RefreshCw, HelpCircle } from "lucide-react";

import { useSetoran } from "../hooks/useSetoran";
import { SetoranForm } from "../modules/form/components/SetoranForm";
import { DynamicExamForm } from "../components/DynamicExamForm";
import { Setoran } from "@/components/custom/typed-text";
import { type FormMode } from "../hooks/useSmartSetoranMode";
import { ModeBadge } from "../components/SetoranModeBanner";
import { useAuth } from "@/features/auth";
import { useTour } from "@/hooks/useTour";
import { type DriveStep } from "driver.js";

export function InputSetoranPage({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const { user } = useAuth();
  const {
    santriList,
    sesiList,
    loading,
    fetchSantri,
    addSetoran,
  } = useSetoran();

  const [isFormValid, setIsFormValid] = useState(true);
  const [activeTab, setActiveTab] = useState<"setoran" | "ujian">("setoran");
  const [formMode, setFormMode] = useState<FormMode>("idle");
  const [isFormChecking, setIsFormChecking] = useState(false);

  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  const isEditMode = formMode === "edit";
  const isIdle = formMode === "idle";

  const steps: DriveStep[] = [
    {
      element: '[data-tour="setoran-tabs-nav"]',
      popover: {
        title: "Navigasi Menu Setoran 📝",
        description: "Beralih antara mencatat Setoran Harian (ziyadah/murajaah) atau mencatat evaluasi berkala di Ujian Tahfiz.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-tour="setoran-form-card"]',
      popover: {
        title: "Formulir Setoran ✍️",
        description: "Pilih nama santri, sesi halaqah, kategori (Ziyadah/Murajaah/Talaqqi), lalu isi juz serta rentang surah dan ayatnya.",
        side: "top",
        align: "center"
      }
    },
    {
      element: '[data-tour="setoran-mushaf-toolbar"]',
      popover: {
        title: "Pilih Ayat dari Mushaf 📖",
        description: "Gunakan fitur interaktif ini untuk membuka mushaf digital dan memilih ayat secara visual langsung dari lembaran halaman mushaf.",
        side: "bottom",
        align: "center"
      }
    },
    {
      element: '[data-tour="setoran-submit-btn"]',
      popover: {
        title: "Simpan Setoran 💾",
        description: "Setelah seluruh detail terisi dengan benar, tekan tombol 'Simpan Setoran' untuk merekam data secara permanen.",
        side: "top",
        align: "end"
      }
    }
  ];

  const { restartTour } = useTour({
    tourKey: "tour_setoran",
    steps,
    userId: user?.id_user,
    autoStart: true,
    ready: !loading
  });

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
            <div className="flex items-center gap-2">
              <Setoran />
              <Button
                onClick={restartTour}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-primary rounded-full"
                title="Mulai Panduan Setoran"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigasi Tab */}
      <div className="flex flex-wrap gap-2 border-b pb-4" data-tour="setoran-tabs-nav">
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
            <Card data-tour="setoran-form-card">
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
                        <span className="font-medium text-foreground">
                          Pilih dari Mushaf
                        </span>{" "}
                        untuk memilih ayat langsung dari tampilan mushaf
                        interaktif.
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
                data-tour="setoran-submit-btn"
                type="submit"
                form="setoran-form"
                disabled={
                  loading ||
                  isFormChecking ||
                  santriList.length === 0 ||
                  !isFormValid ||
                  isIdle
                }
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
                Form penilaian ujian santri tahfiz berdasarkan jadwal
                pelaksanaan aktif.
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