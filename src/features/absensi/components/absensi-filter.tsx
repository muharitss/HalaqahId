import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAbsensi } from "./absensi-provider";

export function AbsensiFilter() {
  const {
    filteredSesiList,
    selectedSesi,
    setSelectedSesi,
    selectedDate,
    setSelectedDate,
    isLoadingSync,
  } = useAbsensi();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-end gap-2">
      <Select
        value={selectedSesi ? selectedSesi.toString() : ""}
        onValueChange={(val) => setSelectedSesi(Number(val))}
        disabled={isLoadingSync || filteredSesiList.length === 0}
      >
        <SelectTrigger className="w-full md:w-60 border-primary/20 shadow-sm">
          <SelectValue placeholder="Pilih Sesi" />
        </SelectTrigger>
        <SelectContent>
          {filteredSesiList.map((sesi) => (
            <SelectItem key={sesi.id_sesi} value={sesi.id_sesi.toString()}>
              {sesi.nama_sesi} ({sesi.jam_mulai} - {sesi.jam_selesai})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full md:w-60 justify-start text-left font-normal border-primary/20 hover:border-primary shadow-sm"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {format(selectedDate, "dd MMMM yyyy", { locale: localeId })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={(date) => date > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
