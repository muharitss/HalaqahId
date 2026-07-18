import { Checkbox } from "@/components/ui/checkbox";

const HARI_OPTIONS = [
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
  { value: 0, label: "Ahad" },
] as const;

const PRESET_HARI = [
  { label: "Senin–Jumat", days: [1, 2, 3, 4, 5], desc: "5 hari" },
  { label: "Senin–Sabtu", days: [1, 2, 3, 4, 5, 6], desc: "6 hari" },
] as const;

interface HariAktifPickerProps {
  value: number[] | null | undefined;
  onChange: (val: number[]) => void;
}

export function HariAktifPicker({ value, onChange }: HariAktifPickerProps) {
  const selected = value ?? [];

  const handleCheckedChange = (day: number, checked: boolean) => {
    if (checked) {
      onChange([...selected, day].sort());
    } else {
      onChange(selected.filter((d) => d !== day));
    }
  };

  const applyPreset = (days: readonly number[]) => {
    onChange([...days].sort());
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Hari Setoran Aktif <span className="text-red-500">*</span></label>
        <div className="flex gap-1.5">
          {PRESET_HARI.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.days)}
              className="text-[11px] px-2 py-0.5 rounded border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors"
            >
              {preset.label} ({preset.desc})
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border rounded-md p-3">
        {HARI_OPTIONS.map((h) => (
          <div key={h.value} className="flex items-center space-x-2">
            <Checkbox
              id={`hari-${h.value}`}
              checked={selected.includes(h.value)}
              onCheckedChange={(checked) => handleCheckedChange(h.value, !!checked)}
            />
            <label
              htmlFor={`hari-${h.value}`}
              className="font-normal cursor-pointer text-sm select-none"
            >
              {h.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
