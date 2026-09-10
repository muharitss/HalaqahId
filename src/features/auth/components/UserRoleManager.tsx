import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Star,
  Trash2,
  Plus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  useRoles,
  useUserRoles,
  useAssignUserRole,
  useRemoveUserRole,
  type UserRoleItem,
} from "@/features/role";
import { type GlobalUser } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

interface UserRoleManagerProps {
  user: GlobalUser;
  onClose?: () => void;
}

export function UserRoleManager({ user, onClose }: UserRoleManagerProps) {
  // Fetch dynamic roles assigned to this user
  const { data: userRoles = [], isLoading: isLoadingUserRoles } = useUserRoles(
    user.id_user
  );

  // Fetch available tenant roles
  const { data: tenantRoles = [], isLoading: isLoadingTenantRoles } = useRoles();

  // Mutations
  const assignRoleMutation = useAssignUserRole();
  const removeRoleMutation = useRemoveUserRole();

  // State for adding a new role
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState<boolean>(false);

  // State for delete confirmation
  const [roleToRemove, setRoleToRemove] = useState<UserRoleItem | null>(null);

  // Filter out roles user already has
  const assignedRoleIds = new Set(userRoles.map((ur) => ur.id_role));
  const availableRoles = tenantRoles.filter((r) => !assignedRoleIds.has(r.id_role));

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) return;

    const roleIdNum = parseInt(selectedRoleId, 10);
    if (isNaN(roleIdNum)) return;

    await assignRoleMutation.mutateAsync({
      userId: user.id_user,
      payload: {
        id_role: roleIdNum,
        is_primary: isPrimary || userRoles.length === 0, // Auto primary if first role
      },
    });

    setSelectedRoleId("");
    setIsPrimary(false);
  };

  const handleSetPrimary = async (roleItem: UserRoleItem) => {
    if (roleItem.is_primary) return;

    await assignRoleMutation.mutateAsync({
      userId: user.id_user,
      payload: {
        id_role: roleItem.id_role,
        is_primary: true,
      },
    });
  };

  const handleConfirmRemove = async () => {
    if (!roleToRemove) return;

    await removeRoleMutation.mutateAsync({
      userId: user.id_user,
      roleId: roleToRemove.id_role,
    });

    setRoleToRemove(null);
  };

  return (
    <div className="space-y-6">
      {/* USER INFO HEADER */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border">
        <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base uppercase shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm truncate">{user.name}</h4>
            <Badge variant="outline" className="text-[10px] uppercase font-mono py-0">
              ID: {user.id_user}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          {user.sekolah && (
            <p className="text-[11px] text-muted-foreground/80 mt-0.5 truncate">
              {user.sekolah.nama_sekolah}
            </p>
          )}
        </div>
      </div>

      {/* CURRENT ROLES LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h5 className="font-semibold text-xs text-foreground uppercase tracking-wider">
              Daftar Role Saat Ini ({userRoles.length})
            </h5>
          </div>
          {userRoles.length === 0 && !isLoadingUserRoles && (
            <span className="text-[11px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium">
              Hanya Role Sistem: {user.role}
            </span>
          )}
        </div>

        {isLoadingUserRoles ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground text-xs gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Memuat role pengguna...</span>
          </div>
        ) : userRoles.length === 0 ? (
          <div className="text-center py-6 px-4 border border-dashed rounded-xl bg-muted/20">
            <Shield className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-xs font-medium text-foreground">
              Belum ada role dinamis yang ditugaskan
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
              Pengguna saat ini menggunakan role bawaan sistem:{" "}
              <strong className="text-foreground">{user.role}</strong>. Silakan
              tambahkan role di bawah.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {userRoles.map((ur) => (
              <div
                key={ur.id_role}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  ur.is_primary
                    ? "bg-primary/5 border-primary/30 shadow-xs"
                    : "bg-background hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${
                      ur.is_primary
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {ur.is_primary ? (
                      <Star className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Shield className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs truncate">
                        {ur.role?.nama_role || `Role #${ur.id_role}`}
                      </span>
                      {ur.is_primary && (
                        <Badge className="bg-primary/15 text-primary hover:bg-primary/20 text-[10px] px-1.5 py-0 border-0">
                          Role Utama
                        </Badge>
                      )}
                      {ur.role?.is_system && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 text-muted-foreground">
                          Sistem
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      {ur.role?.kode_role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {!ur.is_primary && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleSetPrimary(ur)}
                      disabled={assignRoleMutation.isPending}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Jadikan Utama
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setRoleToRemove(ur)}
                    disabled={removeRoleMutation.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* ASSIGN ROLE FORM */}
      <form onSubmit={handleAssignRole} className="space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          <h5 className="font-semibold text-xs text-foreground uppercase tracking-wider">
            Tugaskan Role Baru
          </h5>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="role-select" className="text-xs">
              Pilih Role Tenant
            </Label>
            <Select
              value={selectedRoleId}
              onValueChange={setSelectedRoleId}
              disabled={isLoadingTenantRoles || availableRoles.length === 0}
            >
              <SelectTrigger id="role-select" className="w-full text-xs h-9">
                <SelectValue
                  placeholder={
                    isLoadingTenantRoles
                      ? "Memuat daftar role..."
                      : availableRoles.length === 0
                      ? "Semua role sudah ditugaskan"
                      : "Pilih role untuk ditugaskan..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((r) => (
                  <SelectItem key={r.id_role} value={r.id_role.toString()} className="text-xs">
                    <div className="flex items-center justify-between w-full gap-2">
                      <span>{r.nama_role}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ({r.kode_role})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="is-primary"
              checked={isPrimary || userRoles.length === 0}
              disabled={userRoles.length === 0}
              onCheckedChange={(checked) => setIsPrimary(checked === true)}
            />
            <label
              htmlFor="is-primary"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1.5"
            >
              <span>Jadikan sebagai Role Utama pengguna ini</span>
              {userRoles.length === 0 && (
                <span className="text-[10px] text-muted-foreground italic">
                  (Otomatis untuk role pertama)
                </span>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={onClose}
            >
              Selesai
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            className="text-xs h-8 gap-1.5"
            disabled={!selectedRoleId || assignRoleMutation.isPending}
          >
            {assignRoleMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menugaskan...</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Tugaskan Role</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* ALERT DIALOG CONFIRM REMOVE */}
      <AlertDialog
        open={!!roleToRemove}
        onOpenChange={(open) => !open && setRoleToRemove(null)}
      >
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-1">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <AlertDialogTitle className="text-base">
              Cabut Role Pengguna
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-relaxed">
              Apakah Anda yakin ingin mencabut role{" "}
              <strong className="text-foreground">
                {roleToRemove?.role?.nama_role} ({roleToRemove?.role?.kode_role})
              </strong>{" "}
              dari pengguna <strong className="text-foreground">{user.name}</strong>?
              {roleToRemove?.is_primary && (
                <span className="block mt-2 text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ Perhatian: Role ini saat ini adalah Role Utama. Jika dicabut, role
                  lain yang tersisa akan otomatis dipromosikan sebagai role utama.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-2">
            <AlertDialogCancel className="text-xs h-8">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="text-xs h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleConfirmRemove}
              disabled={removeRoleMutation.isPending}
            >
              {removeRoleMutation.isPending ? "Mencabut..." : "Ya, Cabut Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
