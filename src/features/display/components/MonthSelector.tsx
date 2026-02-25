import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface MonthSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const handleChange = (val: string) => {
    onChange(new Date(val));
  };

  return (
    <Select value={format(value, "yyyy-MM")} onValueChange={handleChange}>
      <SelectTrigger className="w-40 h-9 bg-muted/50 border-none shadow-none focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return (
            <SelectItem key={i} value={format(d, "yyyy-MM")}>
              {format(d, "MMMM yyyy", { locale: localeId })}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}