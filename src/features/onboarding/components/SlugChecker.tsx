import { CheckCircle2, XCircle, Loader2, Globe } from "lucide-react";

interface SlugCheckerProps {
  slug: string;
  isChecking: boolean;
  isAvailable: boolean | null;
  errorMsg: string | null;
}

export function SlugChecker({
  slug,
  isChecking,
  isAvailable,
  errorMsg,
}: SlugCheckerProps) {
  const displaySlug = slug.trim().toLowerCase() || "nama-lembaga";

  return (
    <div className="space-y-2">
      {/* URL Domain Preview */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/40 text-xs">
        <Globe className="w-4 h-4 text-primary shrink-0" />
        <span className="text-muted-foreground truncate">
          URL Akses:{" "}
          <span className="font-semibold text-foreground font-mono">
            https://{displaySlug}.halaqah.id
          </span>
        </span>
      </div>

      {/* Real-time Status Badge */}
      {isChecking && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-in fade-in">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
          <span>Memeriksa ketersediaan slug...</span>
        </div>
      )}

      {!isChecking && isAvailable === true && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Slug &quot;{slug}&quot; tersedia untuk lembaga Anda!</span>
        </div>
      )}

      {!isChecking && errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-destructive font-medium animate-in fade-in">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
