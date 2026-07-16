import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { sekolahService } from "@/features/sekolah/api/sekolahService";
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
import type { SantriAccordionProps as SantriAccordionPropsType, GroupedSantriItem, SetoranItem } from "@/features/setoran/types";

export function SantriAccordion({ santriGroup }: SantriAccordionPropsType) {
  const { data: profileData } = useQuery({
    queryKey: ["schoolProfile"],
    queryFn: () => sekolahService.getProfile(),
  });

  const customFields = useMemo(() => {
    return (profileData?.data?.form_setoran_config as any[]) || [];
  }, [profileData]);

  const showEvaluasiColumn = useMemo(() => {
    if (customFields.length > 0) return true;
    return Object.values(santriGroup).some((s: GroupedSantriItem) =>
      s.setoran.some((set: SetoranItem) => set.taqwim !== null && set.taqwim !== undefined && set.taqwim !== 0)
    );
  }, [santriGroup, customFields]);

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {Object.values(santriGroup).map((santri: GroupedSantriItem) => (
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
                  {showEvaluasiColumn && <TableHead className="font-bold">Evaluasi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {santri.setoran.map((s: SetoranItem) => (
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
                      {(() => {
                        const kategoriName = s.kategori?.nama_kategori || "HAFALAN";
                        return (
                          <Badge
                            variant={kategoriName.toUpperCase() === "HAFALAN" ? "default" : "secondary"}
                            className="text-[10px] font-normal"
                          >
                            {kategoriName}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    {showEvaluasiColumn && (
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          {s.custom_values && typeof s.custom_values === "object" &&
                            Object.entries(s.custom_values).map(([key, val]) => {
                              const fieldConfig = customFields.find((f) => f.id === key);
                              if (!fieldConfig) return null;
                              if (val === undefined || val === null || val === "") return null;

                              let displayVal = String(val);
                              if (fieldConfig.type === "boolean") {
                                displayVal = val ? "Ya" : "Tidak";
                              }

                              return (
                                <span key={key} className="text-xs leading-tight block">
                                  <span className="text-muted-foreground">{fieldConfig.label}:</span>{" "}
                                  <span className="font-semibold">{displayVal}</span>
                                </span>
                              );
                            })
                          }

                          {s.taqwim !== null && s.taqwim !== undefined && (
                            (!s.custom_values ||
                              !Object.keys(s.custom_values).some((k) =>
                                k.toLowerCase() === "taqwim" || k.toLowerCase() === "jumlah_salah"
                              )) && (
                                <span className={`text-sm font-bold ${s.taqwim === 0 ? "text-primary" : "text-orange-600"}`}>
                                  {s.taqwim}
                                </span>
                              )
                            )
                          }

                          {s.keterangan && (
                            <span className="text-[10px] italic text-muted-foreground truncate max-w-30 block mt-0.5">
                              {s.keterangan}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )}
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
