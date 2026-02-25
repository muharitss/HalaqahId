import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import type { HalaqahSelectorProps } from "../types";

export function HalaqahSelector({ halaqahNames, activeHalaqah, onHalaqahChange }: HalaqahSelectorProps) {
  if (halaqahNames.length === 0) return null;

  return (
    <Select value={activeHalaqah} onValueChange={onHalaqahChange}>
      <SelectTrigger className="w-full sm:w-50 bg-background shadow-sm">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5 text-primary/60" />
          <SelectValue placeholder="Pilih Halaqah" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {halaqahNames.map((name) => (
          <SelectItem key={name} value={name} className="capitalize">
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}