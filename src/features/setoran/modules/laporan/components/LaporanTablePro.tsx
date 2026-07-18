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
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GroupedData, GroupedSantriItem, SetoranItem, SetoranRecord } from "@/features/setoran/types";
import { cn } from "@/lib/utils";
import { EditSetoranModal } from "../../form/components/EditSetoranModal";
import { useSetoran } from "../../../hooks/useSetoran";
import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SetoranRow {
  id_setoran: number;
  id_santri: number;
  tanggal_setoran: string;
  nama_santri: string;
  nama_halaqah: string;
  nama_muhafiz?: string;
  juz: number;
  surat: string;
  ayat: string;
  id_kategori: number;
  kategori: string;
  taqwim: number | null;
  keterangan?: string;
  custom_values?: Record<string, any> | null;
}

interface LaporanTableProProps {
  groupedData: GroupedData;
  activeHalaqah: string;
  filterComponent?: React.ReactNode;
  isFilterActive?: boolean;
}

type SortKey = "tanggal_setoran" | "nama_santri" | "juz" | "kategori" | "taqwim";
type SortDir = "asc" | "desc";

export function LaporanTablePro({
  groupedData,
  activeHalaqah,
  filterComponent,
  isFilterActive,
}: LaporanTableProProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("tanggal_setoran");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilter, setShowFilter] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const { updateSetoran, deleteSetoran } = useSetoran();
  const [editingSetoran, setEditingSetoran] = useState<SetoranRecord | null>(null);
  const [deletingSetoranId, setDeletingSetoranId] = useState<number | null>(null);

  const { data: profileData } = useQuery({
    queryKey: ["schoolProfile"],
    queryFn: () => sekolahService.getProfile(),
  });

  const customFields = useMemo(() => {
    return (profileData?.data?.form_setoran_config as any[]) || [];
  }, [profileData]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const allRows = useMemo<SetoranRow[]>(() => {
    const rows: SetoranRow[] = [];
    Object.entries(groupedData).forEach(([halaqahName, group]) => {
      if (activeHalaqah !== "all" && activeHalaqah !== "" && halaqahName !== activeHalaqah) return;
      Object.values(group.santriGroup).forEach((santri: GroupedSantriItem) => {
        santri.setoran.forEach((s: SetoranItem) => {
          const kategoriName = s.kategori?.nama_kategori || (typeof s.kategori === "string" ? s.kategori : "Setoran");
          rows.push({
            id_setoran: s.id_setoran,
            id_santri: s.id_santri,
            tanggal_setoran: s.tanggal_setoran,
            nama_santri: santri.nama,
            nama_halaqah: halaqahName,
            nama_muhafiz: group.muhafizName,
            juz: s.juz,
            surat: s.surat,
            ayat: s.ayat,
            id_kategori: s.id_kategori,
            kategori: kategoriName,
            taqwim: s.taqwim !== undefined ? s.taqwim : null,
            keterangan: s.keterangan || undefined,
            custom_values: s.custom_values || null,
          });
        });
      });
    });
    return rows;
  }, [groupedData, activeHalaqah]);

  const hasHistoricalTaqwim = useMemo(() => {
    return allRows.some((row) => row.taqwim !== null && row.taqwim !== undefined && row.taqwim !== 0);
  }, [allRows]);

  const showEvaluasiColumn = customFields.length > 0 || hasHistoricalTaqwim;

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
      let av: string | number = a[sortKey] ?? "";
      let bv: string | number = b[sortKey] ?? "";
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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortedRows.length]);

  const totalPages = Math.ceil(sortedRows.length / 10);
  const displayedRows = useMemo(() => {
    return showAll
      ? sortedRows
      : sortedRows.slice((currentPage - 1) * 10, currentPage * 10);
  }, [sortedRows, showAll, currentPage]);

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

  const groupedRows = useMemo(() => {
    const groups: Record<string, SetoranRow[]> = {};
    displayedRows.forEach((row) => {
      const gName = row.nama_halaqah || "Tanpa Halaqah";
      if (!groups[gName]) {
        groups[gName] = [];
      }
      groups[gName].push(row);
    });
    return groups;
  }, [displayedRows]);

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
                {showEvaluasiColumn && (
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("taqwim")}
                      className="hover:bg-transparent -ml-4 -mr-4 ml-auto"
                    >
                      Evaluasi {renderSortIcon("taqwim")}
                    </Button>
                  </TableHead>
                )}
                <TableHead className="text-right pr-6 w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showEvaluasiColumn ? 6 : 5} className="text-center py-16 text-muted-foreground text-xs font-semibold">
                    {search ? `Tidak ada hasil untuk "${search}"` : "Tidak ada data setoran"}
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(groupedRows).map(([groupName, rows]) => {
                  const isCollapsed = collapsedGroups[groupName];
                  return (
                    <React.Fragment key={`group-${groupName}`}>
                      <TableRow
                        className="bg-muted/20 hover:bg-muted/30 cursor-pointer select-none border-y"
                        onClick={() => toggleGroup(groupName)}
                      >
                        <TableCell colSpan={showEvaluasiColumn ? 6 : 5} className="pl-6 py-2.5 font-semibold text-sm">
                          <div className="flex items-center gap-2">
                            <ChevronRight className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-200",
                              !isCollapsed && "rotate-90 text-primary"
                            )} />
                            <span className="font-bold">
                              {groupName}
                            </span>
                            <Badge variant="secondary">
                              {rows.length} setoran
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>

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
                            {showEvaluasiColumn && (
                              <TableCell className="py-3 text-right">
                                <div className="flex flex-col items-end gap-0.5">
                                  {row.custom_values && typeof row.custom_values === "object" &&
                                    Object.entries(row.custom_values).map(([key, val]) => {
                                      const fieldConfig = customFields.find((f) => f.id === key);
                                      if (!fieldConfig) return null;

                                      if (val === undefined || val === null || val === "") return null;

                                      let displayVal = String(val);
                                      if (fieldConfig.type === "boolean") {
                                        displayVal = val ? "Ya" : "Tidak";
                                      }

                                      return (
                                        <div key={key} className="text-[11px] leading-tight">
                                          <span className="text-muted-foreground">{fieldConfig.label}:</span>{" "}
                                          <span className="font-semibold">{displayVal}</span>
                                        </div>
                                      );
                                    })
                                  }

                                  {row.taqwim !== null && row.taqwim !== undefined && (
                                    (!row.custom_values ||
                                      !Object.keys(row.custom_values).some((k) =>
                                        k.toLowerCase() === "taqwim" || k.toLowerCase() === "jumlah_salah"
                                      )) && (
                                        <div className="text-[11px] leading-tight">
                                          <span className="text-muted-foreground">Taqwim:</span>{" "}
                                          <span className="font-semibold">{row.taqwim}</span>
                                        </div>
                                      )
                                    )
                                  }

                                  {row.keterangan && (
                                    <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[150px] truncate" title={row.keterangan}>
                                      {row.keterangan}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            )}
                            <TableCell className="py-3 text-right pr-6">
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                      <span className="sr-only">Menu aksi</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem
                                      className="cursor-pointer gap-2"
                                      onClick={() => {
                                        const record: SetoranRecord = {
                                          id_setoran: row.id_setoran,
                                          id_santri: row.id_santri,
                                          tanggal_setoran: row.tanggal_setoran,
                                          juz: row.juz,
                                          surat: row.surat,
                                          ayat: row.ayat,
                                          id_kategori: row.id_kategori,
                                          taqwim: row.taqwim ?? 0,
                                          keterangan: row.keterangan || "",
                                          nilai: 0,
                                          santri: {
                                            nama_santri: row.nama_santri,
                                          }
                                        };
                                        setEditingSetoran(record);
                                      }}
                                    >
                                      <Edit className="h-4 w-4 text-muted-foreground" />
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                      onClick={() => setDeletingSetoranId(row.id_setoran)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                      <span>Hapus</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>

          <EditSetoranModal
            isOpen={!!editingSetoran}
            onClose={() => setEditingSetoran(null)}
            setoran={editingSetoran}
            onSubmit={updateSetoran}
          />

          <AlertDialog
            open={deletingSetoranId !== null}
            onOpenChange={(open) => !open && setDeletingSetoranId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Setoran Hafalan</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus data setoran ini? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90 text-white"
                  onClick={async () => {
                    if (deletingSetoranId !== null) {
                      await deleteSetoran(deletingSetoranId);
                      setDeletingSetoranId(null);
                    }
                  }}
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {(sortedRows.length > 10 || showAll) && (
          <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10 shadow-sm">
            <div className="text-xs text-muted-foreground">
              {showAll ? (
                <span>Menampilkan semua <strong>{sortedRows.length}</strong> setoran</span>
              ) : (
                <span>
                  Menampilkan <strong>{Math.min((currentPage - 1) * 10 + 1, sortedRows.length)}</strong> -{" "}
                  <strong>{Math.min(currentPage * 10, sortedRows.length)}</strong> dari{" "}
                  <strong>{sortedRows.length}</strong> setoran
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-3"
                onClick={() => {
                  setShowAll(!showAll);
                  setCurrentPage(1);
                }}
              >
                {showAll ? "Batasi 10 per Halaman" : "Tampilkan Semua"}
              </Button>

              {!showAll && totalPages > 1 && (
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-xs text-muted-foreground min-w-[45px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
