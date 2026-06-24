import { useState, useMemo } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GroupedData, GroupedSantriItem, SetoranItem } from "@/features/setoran/types";

interface SetoranRow {
  id_setoran: number;
  tanggal_setoran: string;
  nama_santri: string;
  nama_halaqah: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: string;
  taqwim: number;
  keterangan?: string;
}

interface LaporanTableProProps {
  groupedData: GroupedData;
  activeHalaqah: string;
  filterComponent?: React.ReactNode;
  isFilterActive?: boolean;
}

const KATEGORI_BADGE: Record<string, string> = {
  HAFALAN:
    "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400",
  MURAJAAH:
    "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400",
  ZIYADAH:
    "bg-violet-500/10 text-violet-700 border-violet-200 dark:text-violet-400",
  INTENS:
    "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400",
  BACAAN:
    "bg-rose-500/10 text-rose-700 border-rose-200 dark:text-rose-400",
};

type SortKey = "tanggal_setoran" | "nama_santri" | "juz" | "kategori" | "taqwim";
type SortDir = "asc" | "desc";

export function LaporanTablePro({ groupedData, activeHalaqah, filterComponent, isFilterActive }: LaporanTableProProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("tanggal_setoran");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilter, setShowFilter] = useState(false);

  // Flatten all rows from groupedData
  const allRows = useMemo<SetoranRow[]>(() => {
    const rows: SetoranRow[] = [];
    Object.entries(groupedData).forEach(([halaqahName, group]) => {
      if (activeHalaqah !== "all" && activeHalaqah !== "" && halaqahName !== activeHalaqah) return;
      Object.values(group.santriGroup).forEach((santri: GroupedSantriItem) => {
        santri.setoran.forEach((s: SetoranItem) => {
          rows.push({
            id_setoran: s.id_setoran,
            tanggal_setoran: s.tanggal_setoran,
            nama_santri: santri.nama,
            nama_halaqah: halaqahName,
            juz: s.juz,
            surat: s.surat,
            ayat: s.ayat,
            kategori: s.kategori,
            taqwim: s.taqwim ?? 0,
            keterangan: s.keterangan || undefined,
          });
        });
      });
    });
    return rows;
  }, [groupedData, activeHalaqah]);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (r) =>
        r.nama_santri.toLowerCase().includes(q) ||
        r.surat.toLowerCase().includes(q) ||
        r.nama_halaqah.toLowerCase().includes(q) ||
        r.kategori.toLowerCase().includes(q)
    );
  }, [allRows, search]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (sortKey === "tanggal_setoran") {
        av = new Date(av as string).getTime();
        bv = new Date(bv as string).getTime();
      }
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [filteredRows, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (col: SortKey) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-primary" />
    );
  };

  const taqwimColor = (val: number) => {
    if (val === 0) return "text-emerald-600 font-bold";
    if (val <= 2) return "text-amber-600 font-bold";
    return "text-rose-600 font-bold";
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
              <Users className="h-3 w-3 text-primary" />
            </div>
            Detail Riwayat Setoran
            <Badge variant="secondary" className="text-xs font-semibold ml-1">
              {sortedRows.length} catatan
            </Badge>
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari santri, surat, halaqah..."
                className="pl-8 h-8 text-xs w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filterComponent && (
              <Button
                variant={isFilterActive ? "default" : "outline"}
                size="sm"
                className="h-8 px-3 text-xs w-full sm:w-auto shrink-0"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filter
                {isFilterActive && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />}
              </Button>
            )}
          </div>
        </div>
        {showFilter && filterComponent && (
          <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200">
            {filterComponent}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-5 font-bold text-xs w-32">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-bold text-xs hover:bg-transparent text-foreground"
                    onClick={() => toggleSort("tanggal_setoran")}
                  >
                    Tanggal {renderSortIcon("tanggal_setoran")}
                  </Button>
                </TableHead>
                <TableHead className="font-bold text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-bold text-xs hover:bg-transparent text-foreground"
                    onClick={() => toggleSort("nama_santri")}
                  >
                    Santri {renderSortIcon("nama_santri")}
                  </Button>
                </TableHead>
                <TableHead className="font-bold text-xs hidden md:table-cell">
                  Halaqah
                </TableHead>
                <TableHead className="font-bold text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-bold text-xs hover:bg-transparent text-foreground"
                    onClick={() => toggleSort("juz")}
                  >
                    Materi {renderSortIcon("juz")}
                  </Button>
                </TableHead>
                <TableHead className="font-bold text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-bold text-xs hover:bg-transparent text-foreground"
                    onClick={() => toggleSort("kategori")}
                  >
                    Kategori {renderSortIcon("kategori")}
                  </Button>
                </TableHead>
                <TableHead className="font-bold text-xs text-right pr-5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-bold text-xs hover:bg-transparent text-foreground ml-auto"
                    onClick={() => toggleSort("taqwim")}
                  >
                    Taqwim {renderSortIcon("taqwim")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                    {search ? `Tidak ada hasil untuk "${search}"` : "Tidak ada data setoran"}
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows.map((row, idx) => (
                  <TableRow
                    key={row.id_setoran}
                    className={`hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`}
                  >
                    <TableCell className="pl-5 py-3">
                      <p className="text-xs font-medium">
                        {format(new Date(row.tanggal_setoran), "dd MMM yyyy", { locale: idLocale })}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(row.tanggal_setoran), "HH:mm")}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-xs font-semibold uppercase leading-tight">
                        {row.nama_santri}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 hidden md:table-cell">
                      <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                        {row.nama_halaqah}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-xs font-medium">
                        Juz {row.juz} — {row.surat}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Ayat {row.ayat}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold border ${KATEGORI_BADGE[row.kategori] ?? "bg-muted"}`}
                      >
                        {row.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right pr-5">
                      <span className={`text-sm ${taqwimColor(row.taqwim)}`}>
                        {row.taqwim}
                      </span>
                      {row.keterangan && (
                        <p className="text-[10px] text-muted-foreground italic max-w-24 ml-auto truncate" title={row.keterangan}>
                          {row.keterangan}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {sortedRows.length > 0 && (
          <div className="px-5 py-3 border-t bg-muted/20 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{sortedRows.length}</span> dari{" "}
              <span className="font-semibold text-foreground">{allRows.length}</span> catatan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
