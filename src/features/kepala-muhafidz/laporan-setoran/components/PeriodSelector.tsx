import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { MONTHS, years, type PeriodSelectorProps } from "../types";

export function PeriodSelector({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange 
}: PeriodSelectorProps) {
  
  const periodLabel = selectedMonth === null || selectedYear === null
    ? "Semua Periode"
    : new Date(selectedYear, selectedMonth).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric"
      });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full sm:w-55 justify-start text-left font-normal shadow-sm">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4 opacity-50" />
          {periodLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-semibold text-sm">Filter Periode</h4>
            <Button 
              variant="ghost" 
              className="h-auto p-0 text-xs text-primary" 
              onClick={() => {
                onMonthChange(null);
                onYearChange(null);
              }}
            >
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-muted-foreground font-bold ml-1">
                Bulan
              </label>
              <Select 
                value={selectedMonth?.toString() ?? "all"} 
                onValueChange={(v) => onMonthChange(v === "all" ? null : parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-muted-foreground font-bold ml-1">
                Tahun
              </label>
              <Select 
                value={selectedYear?.toString() ?? "all"} 
                onValueChange={(v) => onYearChange(v === "all" ? null : parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}