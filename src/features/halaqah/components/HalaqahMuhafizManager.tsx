import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Shield, UserCheck, AlertTriangle, Loader2 } from "lucide-react";
import { muhafizService } from "@/features/muhafiz";
import type { Muhafiz } from "@/features/muhafiz/types";
import { halaqahApi } from "../api/halaqah.api";
import { PeranMuhafiz } from "@/types/domain/enums";
import type { HalaqahMuhafiz, HalaqahMuhafizItem } from "@/types";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";

export interface ManagedMuhafiz {
  id?: number;
  id_user: number;
  name: string;
  email: string;
  nomor_telepon?: string | null;
  peran: PeranMuhafiz;
  is_active?: boolean;
}

export interface HalaqahMuhafizManagerProps {
  idHalaqah?: number;
  initialMuhafiz?: HalaqahMuhafizItem[];
  fallbackMuhafiz?: { id_user: number; name: string; email: string };
  value?: ManagedMuhafiz[];
  onChange?: (list: ManagedMuhafiz[]) => void;
  readOnly?: boolean;
}

export function HalaqahMuhafizManager({
  idHalaqah,
  initialMuhafiz,
  fallbackMuhafiz,
  value,
  onChange,
  readOnly = false,
}: HalaqahMuhafizManagerProps) {
  const labelMuhafiz = useTerminology("MUHAFIZ");

  // State muhafiz list
  const [internalList, setInternalList] = useState<ManagedMuhafiz[]>([]);
  const [allMuhafiz, setAllMuhafiz] = useState<Muhafiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog state: Tambah Muhafiz
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<PeranMuhafiz>(PeranMuhafiz.PENDAMPING);

  // Dialog state: Konfirmasi Hapus
  const [muhafizToDelete, setMuhafizToDelete] = useState<ManagedMuhafiz | null>(null);

  const isControlled = value !== undefined;
  const currentList = isControlled ? value : internalList;

  // Load available muhafiz users from system
  useEffect(() => {
    let isMounted = true;
    muhafizService
      .getAllMuhafiz()
      .then((data) => {
        if (isMounted) setAllMuhafiz(data || []);
      })
      .catch((err) => {
        console.error("Gagal mengambil master data muhafiz:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch list for idHalaqah if in API mode
  const fetchHalaqahMuhafiz = useCallback(async () => {
    if (!idHalaqah) return;
    setIsLoading(true);
    try {
      const data: HalaqahMuhafiz[] = await halaqahApi.getMuhafiz(idHalaqah);
      if (Array.isArray(data) && data.length > 0) {
        const mapped: ManagedMuhafiz[] = data.map((item) => ({
          id: item.id,
          id_user: item.id_user,
          name: item.user?.name || `Muhafiz #${item.id_user}`,
          email: item.user?.email || "",
          nomor_telepon: item.user?.nomor_telepon,
          peran: item.peran,
          is_active: item.is_active,
        }));
        setInternalList(mapped);
      } else if (fallbackMuhafiz && fallbackMuhafiz.id_user > 0) {
        // Backward compatibility fallback
        setInternalList([
          {
            id: fallbackMuhafiz.id_user,
            id_user: fallbackMuhafiz.id_user,
            name: fallbackMuhafiz.name,
            email: fallbackMuhafiz.email,
            peran: PeranMuhafiz.UTAMA,
            is_active: true,
          },
        ]);
      } else {
        setInternalList([]);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar muhafiz halaqah:", err);
      if (fallbackMuhafiz && fallbackMuhafiz.id_user > 0) {
        setInternalList([
          {
            id: fallbackMuhafiz.id_user,
            id_user: fallbackMuhafiz.id_user,
            name: fallbackMuhafiz.name,
            email: fallbackMuhafiz.email,
            peran: PeranMuhafiz.UTAMA,
            is_active: true,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [idHalaqah, fallbackMuhafiz]);

  useEffect(() => {
    if (idHalaqah) {
      fetchHalaqahMuhafiz();
    } else if (initialMuhafiz && initialMuhafiz.length > 0) {
      setInternalList(
        initialMuhafiz.map((m) => ({
          id: m.id,
          id_user: m.id_user,
          name: m.name,
          email: m.email,
          peran: m.peran,
          is_active: m.is_active,
        }))
      );
    } else if (fallbackMuhafiz && fallbackMuhafiz.id_user > 0) {
      setInternalList([
        {
          id: fallbackMuhafiz.id_user,
          id_user: fallbackMuhafiz.id_user,
          name: fallbackMuhafiz.name,
          email: fallbackMuhafiz.email,
          peran: PeranMuhafiz.UTAMA,
          is_active: true,
        },
      ]);
    }
  }, [idHalaqah, initialMuhafiz, fallbackMuhafiz, fetchHalaqahMuhafiz]);

  // Candidates for add dialog (exclude users already in currentList)
  const availableCandidates = useMemo(() => {
    const existingIds = new Set(currentList.map((m) => m.id_user));
    return allMuhafiz.filter((m) => !existingIds.has(m.id_user));
  }, [allMuhafiz, currentList]);

  // Handle Add Muhafiz
  const handleAddSubmit = async () => {
    const userIdNum = parseInt(selectedUserId, 10);
    if (!userIdNum) {
      toast.error(`Pilih ${labelMuhafiz.toLowerCase()} terlebih dahulu`);
      return;
    }

    const targetUser = allMuhafiz.find((m) => m.id_user === userIdNum);
    const candidateName = targetUser?.name || `Muhafiz #${userIdNum}`;
    const candidateEmail = targetUser?.email || "";

    if (idHalaqah) {
      setIsSubmitting(true);
      try {
        await halaqahApi.assignMuhafiz(idHalaqah, {
          id_user: userIdNum,
          peran: selectedRole,
        });
        toast.success(`${labelMuhafiz} berhasil ditugaskan`);
        setIsAddOpen(false);
        setSelectedUserId("");
        await fetchHalaqahMuhafiz();
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : `Gagal menugaskan ${labelMuhafiz.toLowerCase()}`;
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Controlled mode (Form creation)
      let updated = [...currentList];
      // Jika peran baru adalah UTAMA, sesuaikan muhafiz UTAMA sebelumnya menjadi PENDAMPING
      if (selectedRole === PeranMuhafiz.UTAMA) {
        updated = updated.map((m) =>
          m.peran === PeranMuhafiz.UTAMA ? { ...m, peran: PeranMuhafiz.PENDAMPING } : m
        );
      }
      updated.push({
        id_user: userIdNum,
        name: candidateName,
        email: candidateEmail,
        peran: selectedRole,
        is_active: true,
      });

      if (isControlled && onChange) {
        onChange(updated);
      } else {
        setInternalList(updated);
      }

      toast.success(`${labelMuhafiz} ditambahkan ke daftar`);
      setIsAddOpen(false);
      setSelectedUserId("");
    }
  };

  // Handle Change Role
  const handleChangeRole = async (target: ManagedMuhafiz, newRole: PeranMuhafiz) => {
    if (target.peran === newRole) return;

    if (idHalaqah) {
      try {
        await halaqahApi.updateMuhafiz(idHalaqah, target.id_user, { peran: newRole });
        toast.success(`Peran ${target.name} diubah menjadi ${formatRoleName(newRole)}`);
        await fetchHalaqahMuhafiz();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal mengubah peran muhafiz";
        toast.error(msg);
      }
    } else {
      const updated = currentList.map((m) => {
        if (m.id_user === target.id_user) {
          return { ...m, peran: newRole };
        }
        // Jika diubah jadi UTAMA, ubah yang lain jadi PENDAMPING
        if (newRole === PeranMuhafiz.UTAMA && m.peran === PeranMuhafiz.UTAMA) {
          return { ...m, peran: PeranMuhafiz.PENDAMPING };
        }
        return m;
      });

      if (isControlled && onChange) {
        onChange(updated);
      } else {
        setInternalList(updated);
      }
      toast.success(`Peran ${target.name} diubah menjadi ${formatRoleName(newRole)}`);
    }
  };

  // Handle Remove Muhafiz
  const handleRemoveConfirm = async () => {
    if (!muhafizToDelete) return;

    if (idHalaqah) {
      setIsSubmitting(true);
      try {
        await halaqahApi.removeMuhafiz(idHalaqah, muhafizToDelete.id_user);
        toast.success(`${muhafizToDelete.name} berhasil dihapus dari halaqah`);
        setMuhafizToDelete(null);
        await fetchHalaqahMuhafiz();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal menghapus muhafiz";
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const updated = currentList.filter((m) => m.id_user !== muhafizToDelete.id_user);
      if (isControlled && onChange) {
        onChange(updated);
      } else {
        setInternalList(updated);
      }
      toast.success(`${muhafizToDelete.name} dihapus dari daftar`);
      setMuhafizToDelete(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">
            Tim <Term code="MUHAFIZ" /> ({currentList.length})
          </span>
        </div>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              // Jika belum ada UTAMA, jadikan default UTAMA, jika sudah ada default PENDAMPING
              const hasUtama = currentList.some((m) => m.peran === PeranMuhafiz.UTAMA);
              setSelectedRole(hasUtama ? PeranMuhafiz.PENDAMPING : PeranMuhafiz.UTAMA);
              setSelectedUserId("");
              setIsAddOpen(true);
            }}
            className="h-8 gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah <Term code="MUHAFIZ" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-4 border rounded-lg text-sm text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Memuat data {labelMuhafiz.toLowerCase()}...
        </div>
      ) : currentList.length === 0 ? (
        <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
          Belum ada {labelMuhafiz.toLowerCase()} yang ditugaskan pada halaqah ini.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-8 text-xs font-semibold">Nama {labelMuhafiz}</TableHead>
                <TableHead className="h-8 text-xs font-semibold w-36">Peran</TableHead>
                {!readOnly && <TableHead className="h-8 text-xs font-semibold text-right w-16">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentList.map((m) => (
                <TableRow key={m.id_user} className="text-sm">
                  <TableCell className="py-2.5">
                    <div className="font-medium text-foreground">{m.name}</div>
                    {m.email && <div className="text-xs text-muted-foreground">{m.email}</div>}
                  </TableCell>
                  <TableCell className="py-2.5">
                    {readOnly ? (
                      <RoleBadge role={m.peran} />
                    ) : (
                      <Select
                        value={m.peran}
                        onValueChange={(val) => handleChangeRole(m, val as PeranMuhafiz)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="h-7 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={PeranMuhafiz.UTAMA}>Utama</SelectItem>
                          <SelectItem value={PeranMuhafiz.PENDAMPING}>Pendamping</SelectItem>
                          <SelectItem value={PeranMuhafiz.PENGGANTI}>Pengganti</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  {!readOnly && (
                    <TableCell className="py-2.5 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setMuhafizToDelete(m)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Hapus Muhafiz"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog: Tambah Muhafiz */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Tugaskan <Term code="MUHAFIZ" />
            </DialogTitle>
            <DialogDescription>
              Pilih {labelMuhafiz.toLowerCase()} dan tentukan perannya pada halaqah ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Pilih {labelMuhafiz}</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={`Pilih ${labelMuhafiz.toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {availableCandidates.length === 0 ? (
                    <div className="p-2 text-xs text-center text-muted-foreground">
                      Tidak ada {labelMuhafiz.toLowerCase()} lain yang dapat ditugaskan
                    </div>
                  ) : (
                    availableCandidates.map((cand) => (
                      <SelectItem key={cand.id_user} value={cand.id_user.toString()}>
                        {cand.name} {cand.email ? `(${cand.email})` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Peran Penugasan</Label>
              <Select
                value={selectedRole}
                onValueChange={(val) => setSelectedRole(val as PeranMuhafiz)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PeranMuhafiz.UTAMA}>
                    Utama (Penanggung jawab halaqah)
                  </SelectItem>
                  <SelectItem value={PeranMuhafiz.PENDAMPING}>
                    Pendamping (Membantu pengampu utama)
                  </SelectItem>
                  <SelectItem value={PeranMuhafiz.PENGGANTI}>
                    Pengganti (Pengampu cadangan/badal)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleAddSubmit}
              disabled={!selectedUserId || isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Tugaskan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Konfirmasi Hapus */}
      <Dialog
        open={!!muhafizToDelete}
        onOpenChange={(open) => !open && setMuhafizToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Hapus Penugasan <Term code="MUHAFIZ" />
            </DialogTitle>
            <DialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus{" "}
              <strong>{muhafizToDelete?.name}</strong> dari halaqah ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMuhafizToDelete(null)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function RoleBadge({ role }: { role: PeranMuhafiz | string }) {
  switch (role) {
    case PeranMuhafiz.UTAMA:
    case "UTAMA":
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white border-0 text-[11px] px-2 py-0.5">
          Utama
        </Badge>
      );
    case PeranMuhafiz.PENDAMPING:
    case "PENDAMPING":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900 text-[11px] px-2 py-0.5"
        >
          Pendamping
        </Badge>
      );
    case PeranMuhafiz.PENGGANTI:
    case "PENGGANTI":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-900 text-[11px] px-2 py-0.5"
        >
          Pengganti
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}

function formatRoleName(role: PeranMuhafiz): string {
  switch (role) {
    case PeranMuhafiz.UTAMA:
      return "Utama";
    case PeranMuhafiz.PENDAMPING:
      return "Pendamping";
    case PeranMuhafiz.PENGGANTI:
      return "Pengganti";
    default:
      return role;
  }
}
