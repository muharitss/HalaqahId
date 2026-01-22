import { useState, useEffect } from "react";
import { useProgres } from "@/hooks/useProgres";
import { useSetoran } from "@/hooks/useSetoran"; // IMPORT HOOK BARU
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, faSpinner, faHistory 
} from "@fortawesome/free-solid-svg-icons";

// Import komponen tabel yang sudah Anda buat atau kita inline-kan
import { HistoryTable } from "./HistoryTable"; 

export default function ProgresSantriPage() {
  const { progresData, loading: loadingProgres, fetchProgres } = useProgres();
  const { fetchSetoranBySantri, history, loading: loadingHistory } = useSetoran();
  
  const [filterStatus, _setFilterStatus] = useState("semua");
  const [filterTarget, _setFilterTarget] = useState("semua");

  useEffect(() => {
    fetchProgres();
  }, [fetchProgres]);

  const filteredProgres = progresData.filter(progres => {
    const statusMatch = filterStatus === "semua" || progres.status === filterStatus;
    const targetMatch = filterTarget === "semua" || progres.target === filterTarget;
    return statusMatch && targetMatch;
  });

  // Statistik tetap sama

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "On Track": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      default: return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col text-left">
        <h2 className="text-2xl font-bold">Progres Santri</h2>
        <p className="text-muted-foreground text-sm">Klik nama santri untuk melihat riwayat setoran</p>
      </div>

      {/* Bagian Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border">
         <Button variant="outline" onClick={() => fetchProgres()}>
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Refresh
         </Button>
      </div>

      {/* Accordion Daftar Santri */}
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
                className="border rounded-xl bg-card overflow-hidden shadow-sm transition-all duration-200 hover:bg-muted/50" // Efek Hover Terang di sini
              >
                <AccordionTrigger 
                  className="hover:no-underline px-6 py-4"
                  onClick={() => fetchSetoranBySantri(santri.id)} 
                >
                  {/* Grid System: Membuat kolom sejajar sempurna */}
                  <div className="grid grid-cols-12 w-full items-center gap-4 pr-4">
                    
                    {/* Kolom 1: Nama & Avatar (Span 5) */}
                    <div className="col-span-12 md:col-span-5 flex items-center gap-4 text-left">
                      <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                        {santri.nama.charAt(0)}
                      </div>
                      <div className="min-w-0"> {/* min-w-0 penting agar text-truncate bekerja */}
                        <p className="font-bold text-base md:text-lg truncate">{santri.nama}</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${getStatusColor(santri.status)}`}>
                          {santri.status}
                        </span>
                      </div>
                    </div>

                    {/* Kolom 2: Progress Bar (Span 4) - Sekarang lurus karena lebar kolom diatur Grid */}
                    <div className="col-span-8 md:col-span-4 space-y-1">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Progres Hafalan</span>
                        <span className="font-bold">{santri.capaian}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500" 
                          style={{ width: `${santri.capaian}%` }}
                        />
                      </div>
                    </div>

                    {/* Kolom 3: Terakhir Setor (Span 3) */}
                    <div className="col-span-4 md:col-span-3 text-right">
                      <p className="text-[10px] text-muted-foreground italic leading-none">Terakhir Setor</p>
                      <p className="text-sm font-medium mt-1">{santri.terakhirSetor}</p>
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
                    <HistoryTable data={history} />
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