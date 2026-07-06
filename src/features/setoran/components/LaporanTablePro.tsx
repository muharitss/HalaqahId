import React, { useState, useMemo } from "react";
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
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GroupedData, GroupedSantriItem, SetoranItem } from "@/features/setoran/types";
import { cn } from "@/lib/utils";

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

type SortKey = "tanggal_setoran" | "nama_santri" | "juz" | "kategori" | "taqwim";
type SortDir = "asc" | "desc";

export function LaporanTablePro({ groupedData, activeHalaqah, filterComponent, isFilterActive }: LaporanTableProProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("tanggal_setoran");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilter, setShowFilter] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Flatten all rows from groupedData
  const allRows = useMemo<SetoranRow[]>(() => {
    const rows: SetoranRow[] = [];
    Object.entries(groupedData).forEach(([halaqahName, group]) => {
      if (activeHalaqah !== "all" && activeHalaqah !== "" && halaqahName !== activeHalaqah) return;
      Object.values(group.santriGroup).forEach((santri: GroupedSantriItem) => {
        santri.setoran.forEach((s: SetoranItem) => {
          const kategoriName = s.kategori?.nama_kategori || "HAFALAN";
          rows.push({
            id_setoran: s.id_setoran,
            tanggal_setoran: s.tanggal_setoran,
            nama_santri: santri.nama,
            nama_halaqah: halaqahName,
            juz: s.juz,
            surat: s.surat,
            ayat: s.ayat,
            kategori: kategoriName,
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
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1.5 opacity-30" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1.5 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1.5 text-primary" />
    );
  };

  // Group sortedRows by Halaqah name
  const groupedRows = useMemo(() => {
    const groups: Record<string, SetoranRow[]> = {};
    sortedRows.forEach((row) => {
      const gName = row.nama_halaqah || "Tanpa Halaqah";
      if (!groups[gName]) {
        groups[gName] = [];
      }
      groups[gName].push(row);
    });
    return groups;
  }, [sortedRows]);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">Detail Riwayat Setoran</h3>
          <Badge variant="secondary" className="font-bold">
            {sortedRows.length} catatan
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama santri, surat, halaqah..."
              className="pl-9 h-9 text-xs w-full bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filterComponent && (
            <Button
              variant={isFilterActive ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          )}
        </div>
      </div>
      {showFilter && filterComponent && (
        <div className="p-6 border-b bg-muted/20 space-y-4 animate-in fade-in duration-200">
          {filterComponent}
        </div>
      )}
      
      <div className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-36">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("tanggal_setoran")}
                    className="hover:bg-transparent -ml-4"
                  >
                    Tanggal {renderSortIcon("tanggal_setoran")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("nama_santri")}
                    className="hover:bg-transparent -ml-4"
                  >
                    Santri {renderSortIcon("nama_santri")}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Halaqah
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("juz")}
                    className="hover:bg-transparent -ml-4"
                  >
                    Materi {renderSortIcon("juz")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("kategori")}
                    className="hover:bg-transparent -ml-4"
                  >
                    Kategori {renderSortIcon("kategori")}
                  </Button>
                </TableHead>
                <TableHead className="text-right pr-6">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("taqwim")}
                    className="hover:bg-transparent -ml-4 -mr-4 ml-auto"
                  >
                    Taqwim {renderSortIcon("taqwim")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-xs font-semibold">
                    {search ? `Tidak ada hasil untuk "${search}"` : "Tidak ada data setoran"}
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(groupedRows).map(([groupName, rows]) => {
                  const isCollapsed = collapsedGroups[groupName];
                  return (
                    <React.Fragment key={`group-${groupName}`}>
                      {/* Accordion Group Header */}
                      <TableRow
                        className="bg-muted/20 hover:bg-muted/30 cursor-pointer select-none border-y"
                        onClick={() => toggleGroup(groupName)}
                      >
                        <TableCell colSpan={6} className="pl-6 py-2.5 font-semibold text-sm">
                          <div className="flex items-center gap-2">
                            <ChevronRight className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-200",
                              !isCollapsed && "rotate-90 text-primary"
                            )} />
                            <span className="font-bold">{groupName}</span>
                            <Badge variant="secondary">
                              {rows.length} setoran
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Grouped Rows */}
                      {!isCollapsed &&
                        rows.map((row) => (
                          <TableRow
                            key={row.id_setoran}
                            className="hover:bg-muted/5 border-b"
                          >
                            <TableCell className="pl-6 py-3">
                              <div className="font-semibold">
                                {format(new Date(row.tanggal_setoran), "dd MMM yyyy", { locale: idLocale })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(row.tanggal_setoran), "HH:mm")} WIB
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="font-semibold">{row.nama_santri}</div>
                            </TableCell>
                            <TableCell className="py-3 hidden md:table-cell text-muted-foreground">
                              {row.nama_halaqah}
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="font-semibold">
                                Juz {row.juz} — {row.surat}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Ayat {row.ayat}
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge variant="outline">
                                {row.kategori}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3 text-right pr-6">
                              <div className="font-semibold">{row.taqwim}</div>
                              {row.keterangan && (
                                <div className="text-xs text-muted-foreground mt-0.5" title={row.keterangan}>
                                  {row.keterangan}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {sortedRows.length > 0 && (
          <div className="px-6 py-3 border-t bg-muted/10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{sortedRows.length}</span> dari{" "}
              <span className="font-semibold text-foreground">{allRows.length}</span> catatan setoran
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

