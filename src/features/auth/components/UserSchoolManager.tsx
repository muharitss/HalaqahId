import React, { useState } from "react";
import {
  Building2,
  Star,
  Trash2,
  Plus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  useSekolahQueryList,
  useUserSchoolsQuery,
  useAssignUserSchoolMutation,
  useSetPrimarySchoolMutation,
  useRemoveUserSchoolMutation,
} from "@/features/sekolah";
import type { UserSekolahItem } from "@/types/domain/sekolah";
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

interface UserSchoolManagerProps {
  user: GlobalUser;
  onClose?: () => void;
}

export function UserSchoolManager({ user, onClose }: UserSchoolManagerProps) {
  // Fetch schools assigned to this user
  const { data: userSchools = [], isLoading: isLoadingUserSchools } = useUserSchoolsQuery(
    user.id_user
  );

  // Fetch available schools
  const { data: allSchoolsData } = useSekolahQueryList(1, 100);
  const allSchools = allSchoolsData?.data || [];

  // Mutations
  const assignMutation = useAssignUserSchoolMutation();
  const setPrimaryMutation = useSetPrimarySchoolMutation();
  const removeMutation = useRemoveUserSchoolMutation();

  // State for assigning new school
  const [selectedSekolahId, setSelectedSekolahId] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState<boolean>(false);

  // State for delete confirmation
  const [schoolToRemove, setSchoolToRemove] = useState<UserSekolahItem | null>(null);

  // Filter out schools already assigned to user
  const assignedSchoolIds = new Set(userSchools.map((s) => s.id_sekolah));
  const availableSchools = allSchools.filter((s) => !assignedSchoolIds.has(s.id_sekolah));

  const handleAssignSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSekolahId) return;

    const sekolahIdNum = parseInt(selectedSekolahId, 10);
    if (isNaN(sekolahIdNum)) return;

    await assignMutation.mutateAsync({
      userId: user.id_user,
      payload: {
        id_sekolah: sekolahIdNum,
        is_primary: isPrimary || userSchools.length === 0,
      },
    });

    setSelectedSekolahId("");
    setIsPrimary(false);
  };

  const handleSetPrimary = async (item: UserSekolahItem) => {
    if (item.is_primary) return;
    await setPrimaryMutation.mutateAsync({
      userId: user.id_user,
      sekolahId: item.id_sekolah,
    });
  };

  const handleConfirmRemove = async () => {
    if (!schoolToRemove) return;
    await removeMutation.mutateAsync({
      userId: user.id_user,
      sekolahId: schoolToRemove.id_sekolah,
    });
    setSchoolToRemove(null);
  };

  return (
    <div className="space-y-6 py-2">
      {/* USER INFO SUMMARY */}
      <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-xl border border-border/60">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{user.name}</h4>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant="outline" className="text-xs capitalize font-medium">
          {user.role?.toLowerCase().replace("_", " ")}
        </Badge>
      </div>

      {/* ASSIGNED SCHOOLS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sekolah yang Ditugaskan ({userSchools.length})
          </Label>
        </div>

        {isLoadingUserSchools ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Memuat data penugasan sekolah...</span>
          </div>
        ) : userSchools.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed rounded-xl bg-muted/20">
            <Building2 className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium text-foreground">Belum ada penugasan sekolah</p>
            <p className="text-xs text-muted-foreground mt-1">
              Pengguna ini belum terdaftar di lembaga atau sekolah manapun.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {userSchools.map((item) => (
              <div
                key={item.id_sekolah}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  item.is_primary
                    ? "bg-primary/5 border-primary/30 shadow-xs"
                    : "bg-card border-border hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs ${
                      item.is_primary
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {item.sekolah?.logo_url ? (
                      <img
                        src={item.sekolah.logo_url}
                        alt=""
                        className="h-full w-full object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate text-foreground">
                        {item.sekolah?.nama_sekolah || `Sekolah #${item.id_sekolah}`}
                      </span>
                      {item.is_primary && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/15 text-primary text-[10px] h-4.5 px-1.5 font-semibold gap-1"
                        >
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Utama
                        </Badge>
                      )}
                    </div>
                    {item.sekolah?.kota && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.sekolah.kota}
                        {item.sekolah.provinsi ? `, ${item.sekolah.provinsi}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  {!item.is_primary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-muted-foreground hover:text-primary gap-1"
                      onClick={() => handleSetPrimary(item)}
                      disabled={setPrimaryMutation.isPending}
                    >
                      <Star className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Set Utama</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setSchoolToRemove(item)}
                    disabled={removeMutation.isPending}
                    title="Hapus penugasan sekolah"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* ASSIGN NEW SCHOOL FORM */}
      <div className="space-y-4">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5 text-primary" />
          Tugaskan ke Sekolah Lain
        </Label>

        {availableSchools.length === 0 ? (
          <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-lg border border-dashed">
            Pengguna sudah ditugaskan ke seluruh sekolah yang tersedia.
          </p>
        ) : (
          <form onSubmit={handleAssignSchool} className="space-y-3.5">
            <div className="space-y-2">
              <Select value={selectedSekolahId} onValueChange={setSelectedSekolahId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih sekolah untuk ditugaskan..." />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {availableSchools.map((s) => (
                    <SelectItem key={s.id_sekolah} value={s.id_sekolah.toString()}>
                      {s.nama_sekolah}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="isPrimary"
                checked={isPrimary || userSchools.length === 0}
                disabled={userSchools.length === 0}
                onCheckedChange={(checked) => setIsPrimary(checked === true)}
              />
              <label
                htmlFor="isPrimary"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Jadikan sebagai sekolah utama (aktif) pengguna
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {onClose && (
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Tutup
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={!selectedSekolahId || assignMutation.isPending}
                className="gap-1.5"
              >
                {assignMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                <span>Tugaskan Sekolah</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* CONFIRM DELETE ALERT DIALOG */}
      <AlertDialog open={!!schoolToRemove} onOpenChange={(open) => !open && setSchoolToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Hapus Penugasan Sekolah?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus penugasan <strong>{user.name}</strong> dari{" "}
              <strong>{schoolToRemove?.sekolah?.nama_sekolah}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMutation.isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              disabled={removeMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeMutation.isPending ? "Menghapus..." : "Ya, Hapus Penugasan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
