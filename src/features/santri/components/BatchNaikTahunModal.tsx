import { useState, useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Term } from "@/components/ui/Term";
import { toast } from "sonner";
import {
  GraduationCap,
  Calendar,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  XCircle,
} from "lucide-react";
import { type Santri, type BatchNaikTahunRequest } from "../types";
import { useBatchNaikTahun } from "../api/mutations/useBatchNaikTahun";
import { useTahunAjaranList } from "@/features/akademik";

export interface BatchNaikTahunModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSantri: Santri[];
  halaqahList?: Array<{
    id_halaqah: number;
    name_halaqah?: string;
    nama_halaqah?: string;
  }>;
  onSuccess?: () => void;
}

type ActionType = "NAIK" | "TETAP" | "LULUS" | "KELUAR";

interface SantriActionState {
  action: ActionType;
  alasan: string;
}

export function BatchNaikTahunModal({
  isOpen,
  onClose,
  selectedSantri,
  halaqahList = [],
  onSuccess,
}: BatchNaikTahunModalProps) {
  const tahunAjaranSelectId = useId();
  const defaultActionSelectId = useId();
  const { data: tahunAjaranList = [], isLoading: isLoadingTahun } = useTahunAjaranList();

  const [selectedTahunId, setSelectedTahunId] = useState<string>("");
  const [defaultAction, setDefaultAction] = useState<ActionType>("NAIK");
  const [santriActions, setSantriActions] = useState<Record<number, SantriActionState>>({});
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const { mutate: executeBatch, isPending } = useBatchNaikTahun((result) => {
    toast.success(
      `Berhasil memproses ${result.total_processed} santri ke Tahun Ajaran ${result.nama_tahun_ajaran}`
    );
    onSuccess?.();
    handleClose();
  });

  const handleClose = () => {
    setIsConfirming(false);
    setSelectedTahunId("");
    setSantriActions({});
    onClose();
  };

  const handleApplyDefaultToAll = () => {
    const updated: Record<number, SantriActionState> = {};
    selectedSantri.forEach((s) => {
      updated[s.id_santri] = {
        action: defaultAction,
        alasan: santriActions[s.id_santri]?.alasan || "",
      };
    });
    setSantriActions(updated);
    toast.info(`Status "${defaultAction}" diterapkan ke ${selectedSantri.length} santri`);
  };

  const handleActionChange = (santriId: number, action: ActionType) => {
    setSantriActions((prev) => ({
      ...prev,
      [santriId]: {
        action,
        alasan: prev[santriId]?.alasan || "",
      },
    }));
  };

  const handleAlasanChange = (santriId: number, alasan: string) => {
    setSantriActions((prev) => ({
      ...prev,
      [santriId]: {
        action: prev[santriId]?.action || defaultAction,
        alasan,
      },
    }));
  };

  const selectedTahun = tahunAjaranList.find(
    (t) => String(t.id_tahun_ajaran) === selectedTahunId
  );

  const counts = selectedSantri.reduce(
    (acc, s) => {
      const act = santriActions[s.id_santri]?.action || defaultAction;
      acc[act] = (acc[act] || 0) + 1;
      return acc;
    },
    { NAIK: 0, TETAP: 0, LULUS: 0, KELUAR: 0 } as Record<ActionType, number>
  );

  const handleSubmit = () => {
    if (!selectedTahunId) {
      toast.error("Pilih tahun ajaran tujuan terlebih dahulu");
      return;
    }

    const payload: BatchNaikTahunRequest = {
      id_tahun_ajaran_baru: Number(selectedTahunId),
      santri_list: selectedSantri.map((s) => {
        const item = santriActions[s.id_santri];
        return {
          id_santri: s.id_santri,
          action: item?.action || defaultAction,
          alasan: item?.alasan?.trim() || undefined,
        };
      }),
    };

    executeBatch(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Batch Kenaikan Tahun Ajaran & Level
              </DialogTitle>
              <DialogDescription className="text-xs">
                Proses kenaikan jenjang dan tahun akademik untuk{" "}
                <strong>{selectedSantri.length}</strong> <Term code="SANTRI" /> terpilih.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isConfirming ? (
            <>
              {/* Step 1: Target School Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/20">
                <div className="space-y-1.5">
                  <Label htmlFor={tahunAjaranSelectId} className="text-xs font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Tahun Ajaran Baru (Tujuan) *
                  </Label>
                  <Select
                    value={selectedTahunId}
                    onValueChange={setSelectedTahunId}
                    disabled={isLoadingTahun}
                  >
                    <SelectTrigger id={tahunAjaranSelectId} className="w-full text-xs sm:text-sm">
                      <SelectValue placeholder="Pilih Tahun Ajaran Tujuan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tahunAjaranList.map((t) => (
                        <SelectItem
                          key={t.id_tahun_ajaran}
                          value={String(t.id_tahun_ajaran)}
                        >
                          {t.nama} {t.is_aktif ? "(Sedang Aktif)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Catatan riwayat akademik baru akan ditautkan ke tahun ajaran ini.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={defaultActionSelectId} className="text-xs font-semibold flex items-center gap-1.5">
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                    Aksi Massal Default
                  </Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={defaultAction}
                      onValueChange={(val) => setDefaultAction(val as ActionType)}
                    >
                      <SelectTrigger id={defaultActionSelectId} className="flex-1 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NAIK">Naik (Tahun / Level)</SelectItem>
                        <SelectItem value="TETAP">Tetap (Mengulang)</SelectItem>
                        <SelectItem value="LULUS">Lulus</SelectItem>
                        <SelectItem value="KELUAR">Keluar</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleApplyDefaultToAll}
                      className="text-xs whitespace-nowrap"
                    >
                      Terapkan ke Semua
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Terapkan aksi serentak atau sesuaikan per individu santri di bawah.
                  </p>
                </div>
              </div>

              {/* Step 2: Per-santri custom list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Daftar Santri ({selectedSantri.length})
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 text-[10px]">
                      Naik: {counts.NAIK}
                    </Badge>
                    <Badge variant="outline" className="text-amber-700 bg-amber-50 text-[10px]">
                      Tetap: {counts.TETAP}
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 bg-blue-50 text-[10px]">
                      Lulus: {counts.LULUS}
                    </Badge>
                    <Badge variant="outline" className="text-rose-700 bg-rose-50 text-[10px]">
                      Keluar: {counts.KELUAR}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <div className="max-h-[320px] overflow-y-auto divide-y">
                    {selectedSantri.map((s, idx) => {
                      const currentAction = santriActions[s.id_santri]?.action || defaultAction;
                      const currentAlasan = santriActions[s.id_santri]?.alasan || "";
                      const halaqahName =
                        halaqahList.find((h) => h.id_halaqah === s.id_halaqah)?.nama_halaqah ||
                        halaqahList.find((h) => h.id_halaqah === s.id_halaqah)?.name_halaqah ||
                        s.halaqah?.name_halaqah ||
                        "-";

                      return (
                        <div
                          key={s.id_santri}
                          className="p-3 bg-card hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-mono text-[11px]">
                                #{idx + 1}
                              </span>
                              <span className="font-semibold text-foreground truncate">
                                {s.nama_santri}
                              </span>
                              {s.nomor_induk_santri && (
                                <Badge variant="secondary" className="font-mono text-[10px] px-1 py-0">
                                  {s.nomor_induk_santri}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              <Term code="HALAQAH" />: {halaqahName}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Select
                              value={currentAction}
                              onValueChange={(val) =>
                                handleActionChange(s.id_santri, val as ActionType)
                              }
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NAIK">Naik</SelectItem>
                                <SelectItem value="TETAP">Tetap</SelectItem>
                                <SelectItem value="LULUS">Lulus</SelectItem>
                                <SelectItem value="KELUAR">Keluar</SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder="Catatan/alasan (opsional)..."
                              value={currentAlasan}
                              onChange={(e) => handleAlasanChange(s.id_santri, e.target.value)}
                              className="w-40 sm:w-48 h-8 text-xs"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Confirmation Step */
            <div className="space-y-4 py-2">
              <Alert className="border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="font-semibold text-sm">
                  Konfirmasi Proses Kenaikan Tahun Ajaran
                </AlertTitle>
                <AlertDescription className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                  Aksi batch ini akan memproses <strong>{selectedSantri.length}</strong> santri
                  ke tahun ajaran baru secara permanen dan mencatat riwayat akademik masing-masing.
                </AlertDescription>
              </Alert>

              <div className="p-4 rounded-xl border bg-card space-y-3 text-xs">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Tahun Ajaran Baru:</span>
                  <span className="font-bold text-foreground text-sm">
                    {selectedTahun?.nama || "-"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200">
                    <ArrowUpRight className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground block">Naik</span>
                    <strong className="text-emerald-700 text-sm">{counts.NAIK} Santri</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                    <Clock className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground block">Tetap</span>
                    <strong className="text-amber-700 text-sm">{counts.TETAP} Santri</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground block">Lulus</span>
                    <strong className="text-blue-700 text-sm">{counts.LULUS} Santri</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200">
                    <XCircle className="h-4 w-4 text-rose-600 mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground block">Keluar</span>
                    <strong className="text-rose-700 text-sm">{counts.KELUAR} Santri</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 px-6 border-t flex flex-row items-center justify-between sm:justify-between gap-2">
          {!isConfirming ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!selectedTahunId || selectedSantri.length === 0}
                onClick={() => setIsConfirming(true)}
                className="gap-2"
              >
                Lanjutkan Konfirmasi
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => setIsConfirming(false)}
              >
                Kembali
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={handleSubmit}
                className="gap-2 bg-primary"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Konfirmasi & Proses ({selectedSantri.length})
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
