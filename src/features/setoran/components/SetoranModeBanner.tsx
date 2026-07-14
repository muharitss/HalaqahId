import { Info, AlertTriangle, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type FormMode } from "../hooks/useSmartSetoranMode";

// ─────────────────────────────────────────────────────────────────────────────
// Edit Mode Banner
// ─────────────────────────────────────────────────────────────────────────────

interface EditModeBannerProps {
  santriName?: string;
  tanggal?: string | null;
  sesiName?: string;
  onDismiss?: () => void;
  className?: string;
}

export function EditModeBanner({
  santriName,
  tanggal,
  sesiName,
  onDismiss,
  className,
}: EditModeBannerProps) {
  const formattedDate = tanggal
    ? new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "tanggal yang dipilih";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "relative flex items-start gap-3 rounded-lg border px-4 py-3",
        "border-blue-300 bg-blue-50 text-blue-800",
        "dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
        "animate-in slide-in-from-top-2 fade-in duration-200",
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-blue-900 dark:text-blue-200">
          Mode Edit Aktif
        </p>
        <p className="mt-0.5 text-blue-700 dark:text-blue-300">
          Setoran untuk{" "}
          {santriName && <span className="font-medium">{santriName}</span>}
          {" pada "}
          <span className="font-medium">{formattedDate}</span>
          {sesiName && (
            <>
              {", sesi "}
              <span className="font-medium">{sesiName}</span>
            </>
          )}{" "}
          sudah tercatat. Form telah diisi otomatis — Anda dapat langsung
          memperbarui data tersebut.
        </p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-0.5 text-blue-600 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/50"
          aria-label="Tutup banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Check Error Banner
// ─────────────────────────────────────────────────────────────────────────────

interface CheckErrorBannerProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

export function CheckErrorBanner({
  message,
  onRetry,
  className,
}: CheckErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3",
        "border-amber-300 bg-amber-50 text-amber-800",
        "dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
        "animate-in slide-in-from-top-2 fade-in duration-200",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-amber-900 dark:text-amber-200">
          Gagal Memeriksa Data
        </p>
        <p className="mt-0.5 text-amber-700 dark:text-amber-300">{message}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="shrink-0 h-7 gap-1.5 border-amber-400 text-amber-800 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/30"
      >
        <RefreshCw className="h-3 w-3" />
        Coba Lagi
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Checking Indicator (inline)
// ─────────────────────────────────────────────────────────────────────────────

interface CheckingIndicatorProps {
  className?: string;
}

export function CheckingIndicator({ className }: CheckingIndicatorProps) {
  return (
    <div
      role="status"
      aria-label="Memeriksa data setoran"
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        "animate-in fade-in duration-200",
        className,
      )}
    >
      <svg
        className="h-3.5 w-3.5 animate-spin text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>Memeriksa data setoran...</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mode Badge (kecil, di samping judul form)
// ─────────────────────────────────────────────────────────────────────────────

interface ModeBadgeProps {
  mode: FormMode;
  className?: string;
}

export function ModeBadge({ mode, className }: ModeBadgeProps) {
  if (mode === "idle") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        mode === "create" && [
          "bg-emerald-100 text-emerald-800",
          "dark:bg-emerald-900/30 dark:text-emerald-300",
        ],
        mode === "edit" && [
          "bg-blue-100 text-blue-800",
          "dark:bg-blue-900/30 dark:text-blue-300",
        ],
        className,
      )}
    >
      {mode === "create" ? "Mode Tambah" : "Mode Edit"}
    </span>
  );
}
