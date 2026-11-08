import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import type { IzinSantri } from "../types";

interface ApprovalConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "approve" | "reject";
  item: IzinSantri | null;
  onConfirm: (catatan?: string) => void;
  isLoading?: boolean;
}

export function ApprovalConfirmDialog({
  open,
  onOpenChange,
  type,
  item,
  onConfirm,
  isLoading = false,
}: ApprovalConfirmDialogProps) {
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (open) {
      setCatatan("");
    }
  }, [open]);

  if (!item) return null;

  const isApprove = type === "approve";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isApprove ? (
              <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                <XCircle className="w-5 h-5" />
              </div>
            )}
            <DialogTitle>
              {isApprove ? "Setujui Izin Santri" : "Tolak Izin Santri"}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-left">
            Apakah Anda yakin ingin {isApprove ? "menyetujui" : "menolak"} izin santri{" "}
            <span className="font-semibold text-foreground">
              {item.santri?.nama_santri}
            </span>{" "}
            ({item.jenis})?
          </DialogDescription>
        </DialogHeader>

        {isApprove && (
          <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/15 rounded-md text-xs text-muted-foreground">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Menyetujui izin ini akan <strong>otomatis mencatat absensi</strong> santri untuk seluruh sesi pada rentang tanggal izin.
            </span>
          </div>
        )}

        <div className="space-y-1.5 py-1">
          <Label htmlFor="catatan_approval">
            Catatan {isApprove ? "Persetujuan" : "Penolakan"} (Opsional)
          </Label>
          <Textarea
            id="catatan_approval"
            placeholder={
              isApprove
                ? "Contoh: Diizinkan pulang, semoga lekas sembuh."
                : "Contoh: Jadwal ujian tidak dapat ditinggalkan."
            }
            rows={3}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant={isApprove ? "default" : "destructive"}
            onClick={() => onConfirm(catatan.trim() || undefined)}
            disabled={isLoading}
            className={isApprove ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
          >
            {isLoading
              ? "Memproses..."
              : isApprove
              ? "Setujui & Buat Absensi"
              : "Tolak Izin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
