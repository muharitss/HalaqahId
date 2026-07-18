import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Role } from "@/types/domain/enums";
import { useAuth } from "@/features/auth/components/auth-provider";
import { useSekolahQueryList } from "@/features/sekolah";
import {
  useAllUsers,
  useImpersonateUser,
  useVerifyUser,
  useResetPassword,
  useDeleteUser,
} from "../api";
import { type GlobalUser } from "../types";

const PAGE_SIZE = 10;

export function useKelolaUser() {
  const navigate = useNavigate();
  const { user: currentUser, impersonate } = useAuth();

  // Filter States
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [schoolFilter, setSchoolFilter] = useState<string>("ALL");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  // Fetch schools using React Query
  const { data: schoolsData } = useSekolahQueryList(1, 100);
  const schools = schoolsData?.data || [];

  // React Query Queries
  const { data: usersData, isLoading, refetch: fetchUsers } = useAllUsers({
    page: showAll ? 1 : page,
    limit: showAll ? 1000 : PAGE_SIZE,
    search: search.trim() || undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
    id_sekolah: schoolFilter !== "ALL" ? parseInt(schoolFilter) : undefined,
  });

  const users = (usersData?.data || []) as GlobalUser[];
  const totalUsers = usersData?.pagination?.total ?? usersData?.data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

  // Mutations
  const verifyUserMutation = useVerifyUser();
  const resetPasswordMutation = useResetPassword();
  const deleteUserMutation = useDeleteUser();
  const impersonateUserMutation = useImpersonateUser();

  // Dialog States
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<GlobalUser | null>(null);
  const [emailConfirmation, setEmailConfirmation] = useState("");

  const handleSetSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleSetRoleFilter = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleSetSchoolFilter = (val: string) => {
    setSchoolFilter(val);
    setPage(1);
  };

  // ── IMPERSONATION ──
  const handleImpersonate = async (targetUser: GlobalUser) => {
    if (targetUser.id_user === currentUser?.id_user) {
      toast.error("Anda tidak dapat mengimpersonasi diri sendiri");
      return;
    }

    const confirmToast = toast.loading(`Mempersiapkan impersonasi sebagai ${targetUser.name}...`);
    try {
      const res = await impersonateUserMutation.mutateAsync(targetUser.id_user);
      if (res.success && res.data) {
        toast.dismiss(confirmToast);
        toast.success(`Berhasil login sebagai ${targetUser.name}`);

        const impersonatedUserData = {
          id_user: res.data.user.id_user,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          id_sekolah: res.data.user.id_sekolah,
          has_halaqah: !!(res.data.user as any).halaqah,
          token: res.data.token,
        } as any;

        // Trigger impersonate session in provider
        await impersonate(impersonatedUserData, currentUser!);

        // Redirect based on role
        if (targetUser.role === Role.SUPERADMIN) {
          navigate("/superadmin");
        } else if (targetUser.role === Role.ADMIN || targetUser.role === Role.KOORDINATOR_TAHFIZ) {
          navigate("/kepala-muhafidz");
        } else {
          navigate("/muhafidz");
        }
      } else {
        toast.dismiss(confirmToast);
        toast.error(res.message || "Gagal melakukan impersonasi");
      }
    } catch (error: unknown) {
      toast.dismiss(confirmToast);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  // ── VERIFY EMAIL ──
  const handleVerifyEmail = async (id: number) => {
    try {
      const res = await verifyUserMutation.mutateAsync(id);
      if (res.success) {
        toast.success("Email pengguna berhasil diverifikasi secara manual!");
        fetchUsers();
      } else {
        toast.error(res.message || "Gagal memverifikasi email");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  // ── PASSWORD RESET ──
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await resetPasswordMutation.mutateAsync({
        id: selectedUser.id_user,
        data: { password: newPassword },
      });
      if (res.success) {
        toast.success(`Password untuk ${selectedUser.name} berhasil diperbarui!`);
        setIsPasswordOpen(false);
        setNewPassword("");
      } else {
        toast.error(res.message || "Gagal mereset password");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── DELETE USER ──
  const handleDeleteSubmit = async () => {
    if (!userToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await deleteUserMutation.mutateAsync(userToDelete.id_user);
      if (res.success) {
        toast.success("Pengguna berhasil dihapus!");
        setIsDeleteOpen(false);
        setUserToDelete(null);
        setEmailConfirmation("");
        fetchUsers();
      } else {
        toast.error(res.message || "Gagal menghapus pengguna");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    search,
    setSearch: handleSetSearch,
    roleFilter,
    setRoleFilter: handleSetRoleFilter,
    schoolFilter,
    setSchoolFilter: handleSetSchoolFilter,
    page,
    setPage,
    showAll,
    setShowAll,
    schools,
    users,
    isLoading,
    totalUsers,
    totalPages,
    isPasswordOpen,
    setIsPasswordOpen,
    selectedUser,
    setSelectedUser,
    newPassword,
    setNewPassword,
    isSubmitting,
    showPassword,
    setShowPassword,
    isDeleteOpen,
    setIsDeleteOpen,
    userToDelete,
    setUserToDelete,
    emailConfirmation,
    setEmailConfirmation,
    handleImpersonate,
    handleVerifyEmail,
    handleResetPassword,
    handleDeleteSubmit,
  };
}
