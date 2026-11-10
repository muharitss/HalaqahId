import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Download,
  Trash2,
  Edit,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useHariLiburList,
} from "../api/queries/useAkademikQueries";
import { useAkademikMutations } from "../api/mutations/useAkademikMutations";
import { HariLiburForm } from "../components/HariLiburForm";
import { NationalHolidaysImportModal } from "../components/NationalHolidaysImportModal";
import type {
  HariLibur,
  CreateHariLiburPayload,
  UpdateHariLiburPayload,
  NationalHolidayItem,
} from "../types";

export function HariLiburPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

  const yearParam = selectedYear === "all" ? undefined : parseInt(selectedYear, 10);
  const { data: hariLiburList = [], isLoading } = useHariLiburList(yearParam);

  const {
    createHariLiburMutation,
    updateHariLiburMutation,
    deleteHariLiburMutation,
    importHariLiburMutation,
  } = useAkademikMutations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLibur, setEditingLibur] = useState<HariLibur | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleCreate = () => {
    setEditingLibur(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: HariLibur) => {
    setEditingLibur(item);
    setIsFormOpen(true);
  };

  const handleSubmit = async (
    payload: CreateHariLiburPayload | UpdateHariLiburPayload
  ) => {
    if (editingLibur) {
      await updateHariLiburMutation.mutateAsync({
        id: editingLibur.id_libur,
        payload,
      });
    } else {
      await createHariLiburMutation.mutateAsync(payload as CreateHariLiburPayload);
    }
  };

  const handleDelete = async (id: number, ket: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus hari libur "${ket}"?`)) {
      await deleteHariLiburMutation.mutateAsync(id);
    }
  };

  const handleImport = async (items: NationalHolidayItem[]) => {
    await importHariLiburMutation.mutateAsync(items);
  };

  // Sort by date ascending
  const sortedList = useMemo(() => {
    return [...hariLiburList].sort((a, b) =>
      a.tanggal.localeCompare(b.tanggal)
    );
  }, [hariLiburList]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link
            to="/kepala-muhafidz/akademik"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Kalender Akademik
          </Link>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Kelola Hari Libur
          </h1>
          <p className="text-muted-foreground text-sm">
            Daftar hari libur sekolah, cuti bersama, dan hari libur nasional Indonesia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Import Hari Libur Nasional
          </Button>

          <Button size="sm" onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Hari Libur
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Daftar Hari Libur {selectedYear !== "all" ? `Tahun ${selectedYear}` : ""}
            </CardTitle>
            <CardDescription className="text-xs">
              Hari libur yang dicatat di sini otomatis ditampilkan di kalender visual akademik.
            </CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Memuat daftar hari libur...
            </div>
          ) : sortedList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Belum ada hari libur yang tercatat untuk tahun ini.
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Import Libur Nasional
                </Button>
                <Button size="sm" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Manual
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Hari & Tanggal</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead className="w-24 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedList.map((item, idx) => {
                    const dateObj = new Date(item.tanggal);
                    const formattedDate = dateObj.toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                    return (
                      <TableRow key={item.id_libur}>
                        <TableCell className="text-center font-medium text-xs text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {formattedDate}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.keterangan}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(item.id_libur, item.keterangan)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIALOGS */}
      <HariLiburForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingLibur}
        onSubmit={handleSubmit}
        isSubmitting={
          createHariLiburMutation.isPending || updateHariLiburMutation.isPending
        }
      />

      <NationalHolidaysImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImport}
        isImporting={importHariLiburMutation.isPending}
      />
    </div>
  );
}
export default HariLiburPage;
