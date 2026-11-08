import { Input } from "@/components/ui/input";
import type { TerminologyConfigItem } from "../types";

interface TerminologyItemCardProps {
  config: TerminologyConfigItem;
  value: string;
  isSaving?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSave?: () => void;
  onReset: () => void;
}

export function TerminologyItemCard({
  config,
  value,
  disabled,
  onChange,
}: TerminologyItemCardProps) {
  return (
    <div className="space-y-1.5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <label
            htmlFor={`input-${config.code.toLowerCase()}`}
            className="font-medium text-xs text-foreground cursor-pointer"
          >
            {config.defaultLabel}
          </label>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-tight truncate">
        {config.description}
      </p>

      {/* ── Input ── */}
      <Input
        id={`input-${config.code.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder || `Contoh: ${config.defaultLabel}`}
        disabled={disabled}
        className="h-9 text-xs"
      />
    </div>
  );
}
