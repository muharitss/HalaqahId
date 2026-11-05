import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { onboardingApi } from "../api/onboarding.api";
import { useSlugChecker } from "./useSlugChecker";
import type {
  OnboardingFormData,
  RegisterTenantResult,
} from "../types";

const INITIAL_FORM: OnboardingFormData = {
  nama_tenant: "",
  slug: "",
  admin_name: "",
  email_admin: "",
  password: "",
  confirm_password: "",
  nama_sekolah: "",
  jenis_lembaga: "PESANTREN",
  alamat_sekolah: "",
  plan: "TRIAL",
};

export function useOnboardingWizard() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<OnboardingFormData>(INITIAL_FORM);
  const [successResult, setSuccessResult] = useState<RegisterTenantResult | null>(null);

  const slugState = useSlugChecker(form.slug);

  const updateField = (field: keyof OnboardingFormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from nama_tenant if slug has not been manually touched
      if (field === "nama_tenant" && (!prev.slug || prev.slug === prev.nama_tenant.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
        next.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return next;
    });
  };

  const validateCurrentStep = (): { valid: boolean; message?: string } => {
    if (step === 1) {
      if (!form.nama_tenant.trim() || form.nama_tenant.trim().length < 3) {
        return { valid: false, message: "Nama lembaga minimal 3 karakter" };
      }
      if (!slugState.isFormatValid) {
        return { valid: false, message: slugState.errorMsg || "Format slug tidak valid" };
      }
      if (slugState.isAvailable === false) {
        return { valid: false, message: "Slug sudah digunakan, pilih slug lain" };
      }
      if (slugState.isChecking) {
        return { valid: false, message: "Sedang memeriksa slug, mohon tunggu..." };
      }
      return { valid: true };
    }

    if (step === 2) {
      if (!form.email_admin.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_admin.trim())) {
        return { valid: false, message: "Format email admin tidak valid" };
      }
      if (!form.password || form.password.length < 8) {
        return { valid: false, message: "Password minimal 8 karakter" };
      }
      if (form.password !== form.confirm_password) {
        return { valid: false, message: "Konfirmasi password tidak cocok" };
      }
      return { valid: true };
    }

    if (step === 3) {
      if (!form.nama_sekolah.trim() || form.nama_sekolah.trim().length < 3) {
        return { valid: false, message: "Nama sekolah minimal 3 karakter" };
      }
      return { valid: true };
    }

    if (step === 4) {
      return { valid: true };
    }

    return { valid: true };
  };

  const nextStep = () => {
    const val = validateCurrentStep();
    if (!val.valid) {
      toast.error(val.message);
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const registerMutation = useMutation({
    mutationFn: () =>
      onboardingApi.registerTenant({
        nama_tenant: form.nama_tenant.trim(),
        slug: form.slug.trim().toLowerCase(),
        email_admin: form.email_admin.trim().toLowerCase(),
        password: form.password,
        nama_sekolah: form.nama_sekolah.trim(),
      }),
    onSuccess: (data) => {
      setSuccessResult(data);
      toast.success("Lembaga berhasil didaftarkan! Selamat datang di Halaqah.id");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || "Gagal melakukan registrasi";
      toast.error(msg);
    },
  });

  const submitRegistration = () => {
    const val = validateCurrentStep();
    if (!val.valid) {
      toast.error(val.message);
      return;
    }
    registerMutation.mutate();
  };

  return {
    step,
    setStep,
    form,
    updateField,
    slugState,
    validateCurrentStep,
    nextStep,
    prevStep,
    submitRegistration,
    isSubmitting: registerMutation.isPending,
    successResult,
  };
}
