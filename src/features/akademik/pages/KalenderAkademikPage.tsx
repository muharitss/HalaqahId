import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Plus,
  CalendarCheck,
  CheckCircle2,
  Trash2,
  Edit,
  Clock,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  useTahunAjaranList,
  useHariLiburList,
} from "../api/queries/useAkademikQueries";
import { useAkademikMutations } from "../api/mutations/useAkademikMutations";
import { TahunAjaranForm } from "../components/TahunAjaranForm";
import { SemesterForm } from "../components/SemesterForm";
import { AkademikCalendarView } from "../components/AkademikCalendarView";
import type {
  TahunAjaran,
  Semester,
  CreateTahunAjaranPayload,
  UpdateTahunAjaranPayload,
  CreateSemesterPayload,
  UpdateSemesterPayload,
} from "../types";

export function KalenderAkademikPage() {
  const { data: tahunAjaranList = [], isLoading: isLoadingTA } = useTahunAjaranList();
  const { data: hariLiburList = [] } = useHariLiburList();

  const {
    createTahunAjaranMutation,
    updateTahunAjaranMutation,
    setAktifTahunAjaranMutation,
    deleteTahunAjaranMutation,
    createSemesterMutation,
    updateSemesterMutation,
    deleteSemesterMutation,
  } = useAkademikMutations();

  // Dialog states for Tahun Ajaran
  const [isTAFormOpen, setIsTAFormOpen] = useState(false);
  const [editingTA, setEditingTA] = useState<TahunAjaran | null>(null);

  // Dialog states for Semester
  const [isSemesterFormOpen, setIsSemesterFormOpen] = useState(false);
  const [selectedTAForSemester, setSelectedTAForSemester] = useState<number | null>(null);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);

  const activeTahunAjaran = useMemo(
    () => tahunAjaranList.find((ta) => ta.is_aktif) || null,
    [tahunAjaranList]
  );

  const handleCreateTA = () => {
    setEditingTA(null);
    setIsTAFormOpen(true);
  };

  const handleEditTA = (ta: TahunAjaran) => {
    setEditingTA(ta);
    setIsTAFormOpen(true);
  };

  const handleSubmitTA = async (
    payload: CreateTahunAjaranPayload | UpdateTahunAjaranPayload
  ) => {
    if (editingTA) {
      await updateTahunAjaranMutation.mutateAsync({
        id: editingTA.id_tahun_ajaran,
        payload,
      });
    } else {
      await createTahunAjaranMutation.mutateAsync(payload as CreateTahunAjaranPayload);
    }
  };

  const handleDeleteTA = async (id: number, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tahun ajaran "${nama}"?`)) {
      await deleteTahunAjaranMutation.mutateAsync(id);
    }
  };

  const handleSetAktif = async (id: number) => {
    await setAktifTahunAjaranMutation.mutateAsync(id);
  };

  const handleAddSemester = (idTA: number) => {
    setSelectedTAForSemester(idTA);
    setEditingSemester(null);
    setIsSemesterFormOpen(true);
  };

  const handleEditSemester = (idTA: number, sem: Semester) => {
    setSelectedTAForSemester(idTA);
    setEditingSemester(sem);
    setIsSemesterFormOpen(true);
  };

  const handleSubmitSemester = async (
    payload: CreateSemesterPayload | UpdateSemesterPayload
  ) => {
    if (!selectedTAForSemester) return;
    if (editingSemester) {
      await updateSemesterMutation.mutateAsync({
        idTahunAjaran: selectedTAForSemester,
        idSemester: editingSemester.id_semester,
        payload,
      });
    } else {
      await createSemesterMutation.mutateAsync({
        idTahunAjaran: selectedTAForSemester,
        payload: payload as CreateSemesterPayload,
      });
    }
  };

  const handleDeleteSemester = async (idTA: number, idSem: number, namaSem: string) => {
    if (confirm(`Hapus semester "${namaSem}"?`)) {
      await deleteSemesterMutation.mutateAsync({
        idTahunAjaran: idTA,
        idSemester: idSem,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-primary" />
            Kalender Akademik
          </h1>
          <p className="text-muted-foreground text-sm">
            Kelola tahun ajaran, pembagian semester, dan pantau jadwal visual kalender sekolah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/kepala-muhafidz/akademik/program">
            <Button variant="outline" size="sm" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Program & Level
            </Button>
          </Link>

          <Link to="/kepala-muhafidz/akademik/hari-libur">
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarCheck className="h-4 w-4" />
              Kelola Hari Libur
            </Button>
          </Link>

          <Button size="sm" onClick={handleCreateTA} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Tahun Ajaran
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="tahun-ajaran" className="space-y-6">
        <TabsList className="grid w-full sm:w-80 grid-cols-2">
          <TabsTrigger value="tahun-ajaran">Tahun Ajaran & Semester</TabsTrigger>
          <TabsTrigger value="kalender-visual">Kalender Visual</TabsTrigger>
        </TabsList>

        {/* TAB 1: TAHUN AJARAN & SEMESTER */}
        <TabsContent value="tahun-ajaran" className="space-y-6">
          {isLoadingTA ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Memuat data kalender akademik...
            </div>
          ) : tahunAjaranList.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-3">
                <CalendarDays className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                <h3 className="font-semibold text-lg">Belum Ada Tahun Ajaran</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Mulai dengan menambahkan tahun ajaran baru untuk mengorganisasi semester dan proses pembelajaran.
                </p>
                <Button onClick={handleCreateTA} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Tahun Ajaran Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {tahunAjaranList.map((ta) => {
                const semesters = ta.semesters || [];
                return (
                  <Card
                    key={ta.id_tahun_ajaran}
                    className={`overflow-hidden transition-all ${
                      ta.is_aktif
                        ? "border-primary/50 shadow-sm ring-1 ring-primary/20"
                        : "border-border/60"
                    }`}
                  >
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <CardTitle className="text-lg font-bold">
                              {ta.nama}
                            </CardTitle>
                            {ta.is_aktif ? (
                              <Badge className="bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Tahun Ajaran Aktif
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                                onClick={() => handleSetAktif(ta.id_tahun_ajaran)}
                                disabled={setAktifTahunAjaranMutation.isPending}
                              >
                                Jadikan Aktif
                              </Button>
                            )}
                          </div>
                          <CardDescription className="text-xs flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {ta.tanggal_mulai.slice(0, 10)} s/d {ta.tanggal_selesai.slice(0, 10)}
                          </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            onClick={() => handleAddSemester(ta.id_tahun_ajaran)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Tambah Semester
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEditTA(ta)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteTA(ta.id_tahun_ajaran, ta.nama)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                      {semesters.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground italic bg-muted/10 rounded-md">
                          Belum ada semester pada tahun ajaran ini. Klik "Tambah Semester" di atas untuk menambahkan.
                        </div>
                      ) : (
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/20">
                                <TableHead className="w-12 text-center">#</TableHead>
                                <TableHead>Nama Semester</TableHead>
                                <TableHead>Tanggal Mulai</TableHead>
                                <TableHead>Tanggal Selesai</TableHead>
                                <TableHead className="w-24 text-right">Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {semesters.map((sem, idx) => (
                                <TableRow key={sem.id_semester}>
                                  <TableCell className="text-center font-medium text-xs text-muted-foreground">
                                    {idx + 1}
                                  </TableCell>
                                  <TableCell className="font-semibold text-sm">
                                    {sem.nama}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {sem.tanggal_mulai.slice(0, 10)}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {sem.tanggal_selesai.slice(0, 10)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={() =>
                                          handleEditSemester(ta.id_tahun_ajaran, sem)
                                        }
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                        onClick={() =>
                                          handleDeleteSemester(
                                            ta.id_tahun_ajaran,
                                            sem.id_semester,
                                            sem.nama
                                          )
                                        }
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: KALENDER VISUAL */}
        <TabsContent value="kalender-visual" className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Tampilan Kalender Interaktif
            </span>
            <span>
              Menampilkan jadwal hari libur dan periode semester aktif secara real-time.
            </span>
          </div>

          <AkademikCalendarView
            tahunAjaranList={tahunAjaranList}
            activeTahunAjaran={activeTahunAjaran}
            hariLiburList={hariLiburList}
          />
        </TabsContent>
      </Tabs>

      {/* DIALOG FORMS */}
      <TahunAjaranForm
        open={isTAFormOpen}
        onOpenChange={setIsTAFormOpen}
        initialData={editingTA}
        onSubmit={handleSubmitTA}
        isSubmitting={
          createTahunAjaranMutation.isPending || updateTahunAjaranMutation.isPending
        }
      />

      {selectedTAForSemester && (
        <SemesterForm
          open={isSemesterFormOpen}
          onOpenChange={setIsSemesterFormOpen}
          idTahunAjaran={selectedTAForSemester}
          initialData={editingSemester}
          onSubmit={handleSubmitSemester}
          isSubmitting={
            createSemesterMutation.isPending || updateSemesterMutation.isPending
          }
        />
      )}
    </div>
  );
}
export default KalenderAkademikPage;
