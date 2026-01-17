import { useEffect, useMemo, useState } from "react";
import { useSetoran } from "@/hooks/useSetoran";
import { transformSetoranData } from "@/lib/dataTransformer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt,  
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import Laporan from "@/components/ui/TypedText";

export default function LaporanSetoranPage() {
  const { allSetoran, fetchAllSetoran, loading } = useSetoran();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    fetchAllSetoran();
  }, [fetchAllSetoran]);

  const groupedData = useMemo(() => 
    transformSetoranData(allSetoran, selectedMonth), 
  [allSetoran, selectedMonth]);

  const halaqahNames = Object.keys(groupedData);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Laporan/>
          <p className="text-sm text-muted-foreground">Monitoring progres hafalan santri per halaqah.</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4 opacity-50" />
              {format(selectedMonth, "MMMM yyyy", { locale: id })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedMonth}
              onSelect={(date) => date && setSelectedMonth(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {halaqahNames.length === 0 ? (
        <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold">Tidak ada data setoran</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Tidak ditemukan riwayat setoran untuk bulan {format(selectedMonth, "MMMM yyyy", { locale: id })}.
          </p>
        </Card>
      ) : (
        <Tabs defaultValue={halaqahNames[0]} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1 h-auto mb-6">
            {halaqahNames.map((name) => (
              <TabsTrigger key={name} value={name} className="capitalize px-6 py-2">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.values(groupedData).map((group: any) => (
            <TabsContent key={group.name} value={group.name} className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              
              {/* Stats Cards */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-bold">Hafalan Baru</CardTitle>
                    <FontAwesomeIcon icon={faBookOpen} className="text-primary h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{group.totalHafalan}</div>
                    <p className="text-xs text-muted-foreground">Setoran masuk bulan ini</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-bold">Murajaah</CardTitle>
                    <FontAwesomeIcon icon={faSync} className="text-blue-500 h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{group.totalMurajaah}</div>
                    <p className="text-xs text-muted-foreground">Pengulangan hafalan</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-bold">Total Santri</CardTitle>
                    <FontAwesomeIcon icon={faUsers} className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Object.keys(group.santriGroup).length}</div>
                    <p className="text-xs text-muted-foreground">Santri aktif menyetor</p>
                  </CardContent>
                </Card>
              </div> */}

              {/* Santri List with Accordion */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-primary h-4 w-4" />
                  <h3 className="font-bold text-lg">Daftar Progres Santri</h3>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-3">
                  {Object.values(group.santriGroup).map((santri: any) => (
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
                                    <span className={`text-sm font-bold ${s.taqwim === 'Mumtaz' ? 'text-primary' : 'text-orange-600'}`}>
                                      {s.taqwim}
                                    </span>
                                    {s.keterangan && (
                                      <span className="text-[10px] italic text-muted-foreground truncate max-w-[120px]">
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
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}