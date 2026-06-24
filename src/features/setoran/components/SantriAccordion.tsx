import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SantriAccordionProps } from "../types";

export function SantriAccordion({ santriGroup }: SantriAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {Object.values(santriGroup).map((santri: any) => (
        <AccordionItem 
          key={santri.nama} 
          value={santri.nama}
          className="border rounded-md bg-card overflow-hidden last:border-b"
        >
          <AccordionTrigger className="hover:no-underline px-4 py-2 group">
            <div className="flex items-center justify-between w-full pr-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                  {santri.nama.charAt(0)}
                </div>
                <div className="flex flex-col p-3">
                  <p className="font-bold text-sm">{santri.nama}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="font-normal border-primary/20 text-primary bg-primary/5">
                  {santri.stats.HAFALAN} Hafalan
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {santri.stats.MURAJAAH} Murajaah
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {santri.stats.ZIYADAH || 0} Ziyadah
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {santri.stats.INTENS || 0} Intens
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {santri.stats.BACAAN || 0} Bacaan
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0 border-t">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-bold">Tanggal</TableHead>
                  <TableHead className="font-bold">Materi</TableHead>
                  <TableHead className="font-bold">Kategori</TableHead>
                  <TableHead className="font-bold">Kesalahan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {santri.setoran.map((s: any) => (
                  <TableRow key={s.id_setoran}>
                    <TableCell className="text-xs">
                      {format(new Date(s.tanggal_setoran), "dd/MM/yyyy")}
                      <div className="text-muted-foreground font-light">
                        {format(new Date(s.tanggal_setoran), "HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">Juz {s.juz}: {s.surat}</span>
                      <div className="text-xs text-muted-foreground">Ayat {s.ayat}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={s.kategori === "HAFALAN" ? "default" : "secondary"}
                        className="text-[10px] font-normal"
                      >
                        {s.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${s.taqwim === 0 ? 'text-primary' : 'text-orange-600'}`}>
                          {s.taqwim}
                        </span>
                        {s.keterangan && (
                          <span className="text-[10px] italic text-muted-foreground truncate max-w-30">
                            {s.keterangan}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
