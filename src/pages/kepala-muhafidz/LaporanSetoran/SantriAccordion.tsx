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

interface SantriAccordionProps {
  santriGroup: Record<string, any>;
}

export function SantriAccordion({ santriGroup }: SantriAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {Object.values(santriGroup).map((santri: any) => (
        <AccordionItem 
          key={santri.nama} 
          value={santri.nama}
          className="border rounded-md bg-card overflow-hidden"
        >
          <AccordionTrigger className="hover:no-underline px-4 py-4 group">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {santri.nama.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-bold">{santri.nama}</p>
                  <p className="text-xs text-muted-foreground">{santri.setoran.length} aktivitas</p>
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
                  {santri.stats.ZIYADAH} Ziyadah
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {santri.stats.INTENS} Intens
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {santri.stats.BACAAN} Bacaan
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
                  <TableHead className="font-bold">Penilaian</TableHead>
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