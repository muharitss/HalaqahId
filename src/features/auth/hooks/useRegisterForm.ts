import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerAdminSchema, type RegisterFormValues } from "../validation/auth.schema";
import { useRegisterAdmin } from "../api/mutations/useRegisterAdmin";
import { useTenant } from "@/store/tenant-context";
import { getErrorMessage } from "@/utils/error";

export function useRegisterForm() {
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const registerMutation = useRegisterAdmin();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerAdminSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        nama_sekolah: data.nama_sekolah,
        alamat: data.alamat,
        id_tenant: tenant?.id_tenant,
        tenant_slug: tenant?.slug,
      };

      const res = await registerMutation.mutateAsync(payload);
      toast.success(res.message || "Pendaftaran berhasil!");
      setShowSuccessDialog(true);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Pendaftaran gagal. Silakan coba lagi."));
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    isLoading: registerMutation.isPending,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showSuccessDialog,
    setShowSuccessDialog,
    onSubmit,
    navigate,
  };
}
