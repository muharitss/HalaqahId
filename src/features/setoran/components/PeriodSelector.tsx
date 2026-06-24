import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { PeriodSelectorProps } from "../types";

export function PeriodSelector({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange 
}: PeriodSelectorProps) {
  
  const currentValue = selectedMonth !== null && selectedYear !== null
    ? format(new Date(selectedYear, selectedMonth), "yyyy-MM")
    : "all";

  const handleValueChange = (val: string) => {
    if (val === "all") {
      onMonthChange(null);
      onYearChange(null);
    } else {
      const d = new Date(val + "-01");
      onMonthChange(d.getMonth());
      onYearChange(d.getFullYear());
    }
  };

  return (
    <Select 
      value={currentValue} 
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full sm:w-52 shadow-sm border-primary/20 hover:border-primary">
        <SelectValue placeholder="Pilih Periode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Periode</SelectItem>
        {Array.from({ length: 12 }).map((_, i) => {
          const d = new Date(); 
          d.setDate(1); 
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
