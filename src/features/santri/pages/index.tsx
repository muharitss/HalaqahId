import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, faSpinner, faHistory 
} from "@fortawesome/free-solid-svg-icons";

// Import internal
import { useProgres } from "../hooks/useProgres";
import { useSetoran } from "../../setoran/hooks/useSetoran";
import { HistoryTable } from "../components/HistoryTable";
import { Progres } from "@/components/custom/typed-text";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProgresSantriPage() {
  const { progresData, loading: loadingProgres, fetchProgres } = useProgres();
  const { fetchSetoranBySantri, history, loading: loadingHistory } = useSetoran();

  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  const filterStatus = "semua";
  const filterTarget = "semua";

  useEffect(() => {
    fetchProgres();
  }, [fetchProgres]);

  const filteredProgres = progresData.filter(progres => {
    const statusMatch = filterStatus === "semua" || progres.status === filterStatus;
    const targetMatch = filterTarget === "semua" || progres.target === filterTarget;
    return statusMatch && targetMatch;
  });

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const date = new Date(item.tanggal_setoran);
      return (
        date.getMonth().toString() === selectedMonth &&
        date.getFullYear().toString() === selectedYear
      );
    });
  }, [history, selectedMonth, selectedYear]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "On Track": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      default: return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
    }
  };

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <Progres/>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border items-end md:items-center">
        <div className="flex flex-1 gap-2 w-full md:w-auto">
          <div className="flex-1">
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Pilih Bulan</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-[120px]">
            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Tahun</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026].map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button variant="outline" onClick={() => fetchProgres()} className="w-full md:w-auto">
           <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Refresh
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="text-primary" />
            Detail Capaian & Riwayat
        </h3>

        {loadingProgres ? (
          <div className="p-10 text-center"><FontAwesomeIcon icon={faSpinner} spin className="mr-2"/> Memuat data santri...</div>
        ) : filteredProgres.length === 0 ? (
          <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
            Data santri tidak ditemukan.
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {filteredProgres.map((santri) => (
              <AccordionItem 
                key={santri.id} 
                value={santri.id.toString()}
                className="border rounded-xl bg-card overflow-hidden shadow-sm transition-all duration-200 hover:bg-muted/50"
              >
                <AccordionTrigger 
                  className="hover:no-underline px-6 py-4"
                  onClick={() => fetchSetoranBySantri(santri.id)} 
                >
                  <div className="grid grid-cols-12 w-full items-center gap-4 pr-4">
                    <div className="col-span-12 md:col-span-5 flex items-center gap-4 text-left">
                      <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                        {santri.nama.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-base md:text-lg truncate">{santri.nama}</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${getStatusColor(santri.status)}`}>
                          {santri.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="border-t bg-muted/20">
                  {loadingHistory ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Mengambil riwayat setoran...
                    </div>
                  ) : (
                    /* Gunakan filteredHistory di sini */
                    <HistoryTable data={filteredHistory} monthName={months[parseInt(selectedMonth)]} />
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}