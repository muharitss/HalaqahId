"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSetoran } from "../hooks/useSetoran";
import { SetoranForm } from "../components/SetoranForm";
import { Setoran } from "@/components/custom/typed-text";
import { AlertCircle, FileText, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ujianService, type ExamTemplate } from "../api/ujian-api";
import { DynamicExamForm } from "../components/DynamicExamForm";

export function InputSetoranPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { santriList, sesiList, loading, fetchSantri, addSetoran } = useSetoran();
  const [isFormValid, setIsFormValid] = useState(true);
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<string>("setoran"); // "setoran" atau ID templat ujian

  useEffect(() => {
    fetchSantri();
    
    // Fetch templat ujian kustom dari sekolah admin
    ujianService.getExamTemplates()
      .then((res) => {
        if (res.success && res.data) {
          setTemplates(res.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat templat ujian:", err);
      });
  }, [fetchSantri]);

  const activeTemplate = templates.find(t => t.id_template.toString() === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
          <div className="space-y-1">
            <Setoran />
          </div>
        </div>
      )}

      {/* Navigasi Tab Ujian Dinamis */}
      {templates.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b pb-4">
          <Button
            variant={activeTab === "setoran" ? "default" : "outline"}
            onClick={() => setActiveTab("setoran")}
            className="font-bold flex items-center gap-2 h-10 shadow-sm"
          >
            <ClipboardList className="h-4 w-4" />
            Setoran Harian
          </Button>
          {templates.map((temp) => (
            <Button
              key={temp.id_template}
              variant={activeTab === temp.id_template.toString() ? "default" : "outline"}
              onClick={() => setActiveTab(temp.id_template.toString())}
              className="font-bold flex items-center gap-2 h-10 shadow-sm"
            >
              <FileText className="h-4 w-4" />
              {temp.nama_ujian}
            </Button>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1">
        {activeTab === "setoran" ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Form Input Setoran</CardTitle>
                <CardDescription>
                  Masukkan detail hafalan santri terbaru. Gunakan tombol{" "}
                  <span className="font-medium text-foreground">Pilih dari Mushaf</span>{" "}
                  untuk memilih ayat langsung dari tampilan mushaf interaktif.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SetoranForm
                  santriList={santriList}
                  sesiList={sesiList}
                  onSubmit={addSetoran}
                  onValidationChange={setIsFormValid}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
              <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Daftar santri yang muncul hanya yang terdaftar di halaqah Anda.
                  Pastikan data juz dan surah sudah benar sebelum menyimpan.
                  Data halaman dan baris akan tercatat otomatis jika menggunakan fitur Mushaf.
                </p>
              </div>
              <Button
                type="submit"
                form="setoran-form"
                disabled={loading || santriList.length === 0 || !isFormValid}
                className="w-full md:w-auto px-12 h-11 font-bold shadow-lg shadow-primary/20"
              >
                {loading ? "Menyimpan..." : "Simpan Setoran"}
              </Button>
            </div>
          </>
        ) : (
          activeTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>{activeTemplate.nama_ujian}</CardTitle>
                <CardDescription>
                  Form input ujian kustom berdasarkan kriteria penilaian sekolah.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicExamForm
                  template={activeTemplate}
                  santriList={santriList}
                  sesiList={sesiList}
                  onSuccess={() => {
                    setActiveTab("setoran");
                    fetchSantri();
                  }}
                />
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

