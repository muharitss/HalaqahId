import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setoranSchema, type SetoranFormValues } from "@/utils/zodSchema";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSetoran } from "@/hooks/useSetoran";

// UI Components (Shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function InputSetoranPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Ambil data dan fungsi dari hook useSetoran
  const { history, santriList, loading, fetchHistory, fetchSantri, addSetoran } = useSetoran();

  const form = useForm<SetoranFormValues>({
    resolver: zodResolver(setoranSchema) as any,
    defaultValues: {
      santri_id: 0,
      juz: 1,
      kategori: "HAFALAN" as const,
      surah: "",
      ayat_mulai: 1,
      ayat_selesai: 1,
      nilai: 80,
      catatan: "",
      tanggal: new Date(),
    },
  });

  // Fetch daftar santri saat pertama kali load
  useEffect(() => {
    fetchSantri();
  }, [fetchSantri]);

  // Fetch riwayat setiap kali tanggal berubah
  useEffect(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    fetchHistory(dateStr);
  }, [selectedDate, fetchHistory]);

  async function onSubmit(data: SetoranFormValues) {
      const payload = {
        santri_id: Number(data.santri_id),
        juz: Number(data.juz),
        surat: data.surah,
        ayat: `${data.ayat_mulai}-${data.ayat_selesai}`,
        kategori: data.kategori as "HAFALAN" | "MURAJAAH", 
        taqwim: data.nilai >= 90 ? "Mumtaz" : data.nilai >= 80 ? "Jayyid Jiddan" : "Jayyid",
        keterangan: data.catatan || "",
      };

      const result = await addSetoran(payload);
    
    if (result.success) {
      form.reset({
        ...form.getValues(),
        surah: "",
        ayat_mulai: 1,
        ayat_selesai: 1,
        catatan: "",
      });
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      await fetchHistory(dateStr);
      // Refresh list setelah simpan
      fetchHistory(format(selectedDate, "yyyy-MM-dd"));
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue("tanggal", date);
    }
  };

  // Kalkulasi summary dari data API
  const summary = {
    totalSetoran: history.length,
    santriBerbeda: new Set(history.map(s => s.santri_id)).size,
    rataRataNilai: history.length > 0 
      ? (history.reduce((sum, s) => sum + (s.nilai || 0), 0) / history.length).toFixed(1)
      : "0",
  };

  const getNilaiColor = (nilai: number): string => {
    if (nilai >= 90) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    if (nilai >= 80) return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    if (nilai >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Input Setoran Hafalan</CardTitle>
              <div className="flex items-center gap-3 mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-[240px] justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: id })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <CardDescription>
                  Pilih tanggal untuk mengisi atau melihat setoran
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <SummaryCard label="Total Setoran" value={summary.totalSetoran} color="text-blue-600" />
            <SummaryCard label="Santri" value={summary.santriBerbeda} color="text-emerald-600" />
            <SummaryCard label="Rata-rata Nilai" value={summary.rataRataNilai} color="text-amber-600" />
          </div>

          {/* Form */}
          <div className="rounded-xl border p-6 mb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Row 1: Santri & Kategori */}
                  <FormField
                    control={form.control}
                    name="santri_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Santri</FormLabel>
                        <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value.toString()}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Pilih santri" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {santriList.map((s) => (
                              <SelectItem key={s.id_santri} value={s.id_santri.toString()}>{s.nama_santri}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kategori"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="HAFALAN">HAFALAN</SelectItem>
                            <SelectItem value="MURAJAAH">MURAJAAH</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="juz"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Juz</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Row 2: Surah & Ayat */}
                  <FormField
                    control={form.control}
                    name="surah"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surah</FormLabel>
                        <FormControl><Input placeholder="Al-Baqarah" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ayat_mulai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Mulai</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ayat_selesai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Selesai</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700" 
                    disabled={loading || form.formState.isSubmitting}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        {/* <Loader2 className="h-4 w-4 animate-spin" /> */} Menyimpan...
                      </span>
                    ) : (
                      "Simpan Setoran"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Santri</TableHead>
                  <TableHead>Materi</TableHead>
                  <TableHead className="text-center">Nilai</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                      {loading ? "Memuat data..." : "Belum ada riwayat setoran hari ini."}
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((item) => (
                    <TableRow key={item.id_setoran} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{item.santri?.nama_santri}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{item.kategori}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.surat} <br />
                        <span className="text-xs text-muted-foreground">Ayat {item.ayat}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn("font-bold", getNilaiColor(item.nilai))}>
                          {item.nilai}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-komponen bantu agar kode tidak terlalu panjang
function SummaryCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Card className="p-4 flex flex-col items-center justify-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </Card>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}