"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { type Santri } from "@/features/santri/types";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";
import { type SetoranPayload, type MushafSelection } from "../../../types";
import { setoranService } from "../../../api/services/setoranService";
import { useSmartSetoranMode } from "../../../hooks/useSmartSetoranMode";
import { useFormInit } from "../hooks/useFormInit";
import { useDynamicSchema } from "../hooks/useDynamicSchema";
import { useDraftManager } from "../hooks/useDraftManager";
import { buildPayload } from "../hooks/usePayloadBuilder";
import { findJuzBySurahAndAyah } from "../utils/findJuz";
import { TEMP_STORAGE_KEY, DRAFT_STORAGE_KEY, MUSHAF_SELECTION_KEY } from "../constants/form.constants";

import { getErrorMessage } from "@/utils/error";

import { SantriSelector } from "./SantriSelector";
import { SesiSelector } from "./SesiSelector";
import { KategoriSelector } from "./KategoriSelector";
import { TanggalInput } from "./TanggalInput";
import { MushafToolbar } from "./MushafToolbar";
import { JuzSelector } from "./JuzSelector";
import { RangeInput } from "./RangeInput";
import { DynamicFields } from "./DynamicFields";
import { KeteranganInput } from "./KeteranganInput";
import { FormFooter } from "./FormFooter";
import { CheckErrorBanner, CheckingIndicator, EditModeBanner } from "../../../components/SetoranModeBanner";


interface SetoranFormProps {
  santriList: Santri[];
  sesiList: SesiHalaqah[];
  onSubmit: (data: SetoranPayload) => Promise<{ success: boolean }>;
  onValidationChange?: (isValid: boolean) => void;
  onModeChange?: (
    mode: import("../../../hooks/useSmartSetoranMode").FormMode
  ) => void;
  onCheckingChange?: (isChecking: boolean) => void;
}

export function SetoranForm({
  santriList,
  sesiList,
  onSubmit,
  onValidationChange,
  onModeChange,
  onCheckingChange,
}: SetoranFormProps) {
  const [mushafSelection, setMushafSelection] =
    useState<MushafSelection | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const smartMode = useSmartSetoranMode();
  const { customFields } = useDynamicSchema();
  const { form } = useFormInit(customFields);

  const isRestoringDraft = useRef(
    typeof window !== "undefined"
      ? !!(
          sessionStorage.getItem(DRAFT_STORAGE_KEY) ||
          sessionStorage.getItem(MUSHAF_SELECTION_KEY)
        )
      : false
  );

  const prevMode = useRef<import("../../../hooks/useSmartSetoranMode").FormMode>("idle");

  useDraftManager(form, setMushafSelection);

  // Auto juz
  const watchSuratMulai = form.watch("surat_mulai");
  const watchAyatMulai = form.watch("ayat_mulai");
  useEffect(() => {
    if (
      watchSuratMulai &&
      typeof watchAyatMulai === "number" &&
      watchAyatMulai > 0
    ) {
      const calculatedJuz = findJuzBySurahAndAyah(
        watchSuratMulai,
        watchAyatMulai
      );
      if (calculatedJuz !== form.getValues("juz")) {
        form.setValue("juz", calculatedJuz);
      }
    }
  }, [watchSuratMulai, watchAyatMulai, form]);

  // Sync ke smartMode
  const selectedSantriId = form.watch("id_santri");
  const selectedSesiId = form.watch("id_sesi");
  const selectedTanggal = form.watch("tanggal_setoran");
  const selectedKategoriId = form.watch("id_kategori"); // angkat ke variabel agar tidak dipanggil dalam dep array

  useEffect(() => smartMode.setSelectedSantriId(selectedSantriId ?? null), [selectedSantriId, smartMode.setSelectedSantriId]);
  useEffect(() => smartMode.setSelectedSesiId(selectedSesiId ?? null), [selectedSesiId, smartMode.setSelectedSesiId]);
  useEffect(() => smartMode.setSelectedTanggal(selectedTanggal ?? null), [selectedTanggal, smartMode.setSelectedTanggal]);
  useEffect(() => onModeChange?.(smartMode.mode), [smartMode.mode, onModeChange]);
  useEffect(() => onCheckingChange?.(smartMode.isChecking), [smartMode.isChecking, onCheckingChange]);
  useEffect(() => setBannerDismissed(false), [smartMode.mode]);

  // Validasi sesi
  const selectedSesiObj = sesiList.find((s) => s.id_sesi === selectedSesiId);
  const isTodayValidForSesi = useMemo(() => {
    if (
      !selectedSesiObj ||
      !selectedSesiObj.hari ||
      selectedSesiObj.hari.length === 0
    )
      return true;
    const targetDate = selectedTanggal
      ? (() => {
          const [y, m, d] = selectedTanggal.split("-").map(Number);
          return new Date(y, m - 1, d);
        })()
      : new Date();
    const jsDay = targetDate.getDay();
    return selectedSesiObj.hari.includes(jsDay === 0 ? 7 : jsDay);
  }, [selectedSesiObj, selectedTanggal]);

  useEffect(() => onValidationChange?.(isTodayValidForSesi), [isTodayValidForSesi]);

  // Pre-fill saat edit
  useEffect(() => {
    if (isRestoringDraft.current) {
      if (smartMode.mode !== "idle") {
        isRestoringDraft.current = false;
        prevMode.current = smartMode.mode;
      }
      return;
    }

    if (smartMode.mode === "edit" && smartMode.existingData) {
      const data = smartMode.existingData;
      const suratParts = (data.surat || "").split(" - ");
      const suratMulai = suratParts[0]?.trim() || "";
      const suratSelesai = suratParts[1]?.trim() || suratMulai;
      const ayatParts = (data.ayat || "1-1").split("-");

      form.setValue("id_kategori", data.id_kategori);
      form.setValue("juz", data.juz || 1);
      form.setValue("surat_mulai", suratMulai);
      form.setValue("surat_selesai", suratSelesai);
      form.setValue("ayat_mulai", data.start_ayat || parseInt(ayatParts[0]) || 1);
      form.setValue("ayat_selesai", data.end_ayat || parseInt(ayatParts[1]) || 1);
      form.setValue("taqwim", data.taqwim || undefined);
      form.setValue("keterangan", data.keterangan || "");
      if (data.custom_values) form.setValue("custom_values", data.custom_values as any);
      form.trigger();
    } else if (smartMode.mode === "create" && prevMode.current === "edit") {
      form.setValue("juz", 1);
      form.setValue("surat_mulai", "");
      form.setValue("surat_selesai", "");
      form.setValue("ayat_mulai", undefined as any);
      form.setValue("ayat_selesai", undefined as any);
      form.setValue("taqwim", undefined);
      form.setValue("keterangan", "");
      setMushafSelection(null);
    }

    if (smartMode.mode !== "idle") {
      prevMode.current = smartMode.mode;
    }
  }, [smartMode.mode, smartMode.existingData]);

  // Simpan temp ke localStorage
  useEffect(() => {
    if (selectedSantriId || selectedSesiId || selectedKategoriId) {
      localStorage.setItem(
        TEMP_STORAGE_KEY,
        JSON.stringify({
          id_santri: selectedSantriId,
          id_sesi: selectedSesiId,
          id_kategori: selectedKategoriId,
          timestamp: Date.now(),
        })
      );
    }
  }, [selectedSantriId, selectedSesiId, selectedKategoriId]);

  // Submit handler
  const onFormSubmit = async (values: any) => {
    if (!isTodayValidForSesi) {
      toast.error(
        `Sesi "${selectedSesiObj?.nama_sesi || ""}" tidak dijadwalkan pada tanggal yang dipilih (${selectedTanggal || "hari ini"}).`
      );
      return;
    }

    const payload = buildPayload(values, mushafSelection);

    if (smartMode.mode === "edit" && smartMode.recordId) {
      try {
        await setoranService.updateSetoran(smartMode.recordId, payload);
        toast.success("Setoran berhasil diperbarui ✓");
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        sessionStorage.removeItem(MUSHAF_SELECTION_KEY);
        smartMode.retryCheck();
      } catch (err: any) {
        toast.error(getErrorMessage(err, "Gagal memperbarui setoran"));
      }
      return;
    }

    const result = await onSubmit(payload);
    if (result.success) {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      sessionStorage.removeItem(MUSHAF_SELECTION_KEY);
      form.reset({
        ...form.getValues(),
        surat_mulai: "",
        surat_selesai: "",
        ayat_mulai: undefined as any,
        ayat_selesai: undefined as any,
        taqwim: undefined,
        keterangan: "",
        custom_values: {},
      });
      setMushafSelection(null);
      smartMode.retryCheck();
    }
  };

  const selectedSantriName = santriList.find(
    (s) => s.id_santri === selectedSantriId
  )?.nama_santri;
  const selectedSesiName = sesiList.find(
    (s) => s.id_sesi === selectedSesiId
  )?.nama_sesi;

  return (
    <Form {...form}>
      <form
        id="setoran-form"
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="space-y-4"
        aria-busy={smartMode.isChecking}
      >
        {/* Row 1: Santri, Sesi, Kategori, Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SantriSelector form={form} santriList={santriList} />
          <SesiSelector form={form} sesiList={sesiList} />
          <KategoriSelector form={form} />
          <TanggalInput form={form} />
        </div>

        {/* Checking Indicator & Banners */}
        {smartMode.isChecking && <CheckingIndicator />}
        {!smartMode.isChecking && smartMode.checkError && (
          <CheckErrorBanner
            message={smartMode.checkError}
            onRetry={smartMode.retryCheck}
          />
        )}
        {!smartMode.isChecking &&
          !smartMode.checkError &&
          smartMode.mode === "edit" &&
          !bannerDismissed && (
            <EditModeBanner
              santriName={selectedSantriName}
              tanggal={selectedTanggal}
              sesiName={selectedSesiName}
              onDismiss={() => setBannerDismissed(true)}
            />
          )}

        {/* Mushaf Toolbar */}
        <div data-tour="setoran-mushaf-toolbar">
          <MushafToolbar
            form={form}
            mushafSelection={mushafSelection}
            setMushafSelection={setMushafSelection}
          />
        </div>

        {/* Sesi Warning */}
        <FormFooter isValid={isTodayValidForSesi} sesiName={selectedSesiObj?.nama_sesi} />

        {/* Juz Selector */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <JuzSelector form={form} setMushafSelection={setMushafSelection} />
        </div>

        {/* Range Input */}
        <RangeInput form={form} setMushafSelection={setMushafSelection} />

        {/* Dynamic Fields */}
        <DynamicFields form={form} customFields={customFields} />

        {/* Keterangan */}
        <KeteranganInput form={form} />

        {/* Mushaf Selection Info */}
        {mushafSelection && (
          <div className="flex flex-col gap-1 text-xs text-primary bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg w-fit">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">
                Terisi otomatis dari Mushaf: {mushafSelection.totalBaris} baris
              </span>
              <span>
                Hal. {mushafSelection.startPage}
                {mushafSelection.startPage !== mushafSelection.endPage &&
                  `–${mushafSelection.endPage}`}
              </span>
            </div>
            {mushafSelection.isPartialAyah && mushafSelection.startWordText && (
              <div className="text-[10px] text-muted-foreground border-t border-primary/10 pt-1 flex flex-col gap-0.5" dir="ltr">
                <span className="font-medium text-primary/80">Sebagian Ayat (Word range):</span>
                <span className="italic font-serif text-right text-xs" dir="rtl">
                  Dari "{mushafSelection.startWordText}" s.d. "{mushafSelection.endWordText}"
                </span>
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}