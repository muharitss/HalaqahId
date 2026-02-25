import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface SetoranFeedItem {
  tanggal_setoran: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: string;
  taqwim: number;
}

interface PublicSantriData {
  setoran: SetoranFeedItem[];
  stats: {
    HAFALAN: number;
    MURAJAAH: number;
    ZIYADAH: number;
    INTENS: number;
    BACAAN: number;
  };
}

interface PublicSantriFeedProps {
  santriData: PublicSantriData; // Objek santri hasil transform
}


export function PublicSantriFeed({ santriData }: PublicSantriFeedProps) {
  if (!santriData || !santriData.setoran) return null;

  return (
    <div className="space-y-6">
      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-emerald-50 border-emerald-100 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Hafalan Baru</span>
            <span className="text-2xl font-black text-emerald-700">{santriData.stats?.HAFALAN || 0}</span>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-100 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Murajaah</span>
            <span className="text-2xl font-black text-slate-700">{santriData.stats?.MURAJAAH || 0}</span>
          </CardContent>
        </Card>
        <Card className="bg-sky-50 border-sky-100 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Ziyadah</span>
            <span className="text-2xl font-black text-sky-700">{santriData.stats?.ZIYADAH || 0}</span>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Intens</span>
            <span className="text-2xl font-black text-amber-700">{santriData.stats?.INTENS || 0}</span>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 border-indigo-100 shadow-none">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Bacaan</span>
            <span className="text-2xl font-black text-indigo-700">{santriData.stats?.BACAAN || 0}</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Riwayat Langsung (Tanpa Accordion) */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-30">Tanggal</TableHead>
                <TableHead>Materi</TableHead>
                <TableHead className="text-center">Kategori</TableHead>
                <TableHead className="text-right">Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {santriData.setoran.map((s: SetoranFeedItem, idx: number) => (

                <TableRow key={idx}>
                  <TableCell className="text-xs">
                    <div className="font-bold">{format(new Date(s.tanggal_setoran), "dd/MM/yy")}</div>
                    <div className="text-slate-400">{format(new Date(s.tanggal_setoran), "HH:mm")}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold text-slate-800">Juz {s.juz}: {s.surat}</div>
                    <div className="text-[11px] text-slate-500">Ayat {s.ayat}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={s.kategori === "HAFALAN" ? "default" : "outline"} className="text-[9px] px-1.5 py-0">
                      {s.kategori}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm font-bold ${s.taqwim === 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                      {s.taqwim}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}