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
  BookOpen,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  const currentActiveSemester = useMemo(() => {
    if (!activeTahunAjaran?.semesters?.length) return null;
    const todayStr = new Date().toISOString().slice(0, 10);
    return (
      activeTahunAjaran.semesters.find((s) => {
        const start = s.tanggal_mulai ? s.tanggal_mulai.slice(0, 10) : "";
        const end = s.tanggal_selesai ? s.tanggal_selesai.slice(0, 10) : "";
        return start && end && todayStr >= start && todayStr <= end;
      }) || null
    );
  }, [activeTahunAjaran]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kalender Akademik</h1>
          <p className="text-muted-foreground text-sm">
            Kelola tahun ajaran, pembagian semester, dan pantau jadwal visual kalender sekolah
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link to="/kepala-muhafidz/akademik/hari-libur">
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarCheck className="h-4 w-4" />
              Hari Libur
            </Button>
          </Link>

          <Button size="sm" onClick={handleCreateTA} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Tahun Ajaran
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="tahun-ajaran" className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="tahun-ajaran" className="gap-2 text-xs">
            Tahun Ajaran & Semester
          </TabsTrigger>
          <TabsTrigger value="kalender-visual" className="gap-2 text-xs">
            Kalender Visual
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: TAHUN AJARAN & SEMESTER */}
        <TabsContent value="tahun-ajaran" className="space-y-4">
          {isLoadingTA ? (
            <div className="space-y-4">
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </div>
          ) : tahunAjaranList.length === 0 ? (
            <Card className="text-center py-12 shadow-sm">
              <CardContent className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">Belum Ada Tahun Ajaran</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Mulai dengan menambahkan tahun ajaran baru untuk mengorganisasi semester dan proses pembelajaran.
                </p>
                <Button onClick={handleCreateTA} size="sm" className="mt-2 shadow-sm gap-1.5">
                  <Plus className="h-4 w-4" />
                  Tambah Tahun Ajaran Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tahunAjaranList.map((ta) => {
                const semesters = ta.semesters || [];
                return (
                  <Card
                    key={ta.id_tahun_ajaran}
                    className={`shadow-sm transition-all `}
                  >
                    <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                            ta.is_aktif
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">
                              {ta.nama}
                            </CardTitle>
                            {ta.is_aktif ? (
                              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-medium text-[10px] py-0.5 tracking-wide uppercase gap-1 shadow-xs">
                                <CheckCircle2 className="h-3 w-3" />
                                Aktif
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground shadow-none"
                                onClick={() => handleSetAktif(ta.id_tahun_ajaran)}
                                disabled={setAktifTahunAjaranMutation.isPending}
                              >
                                Jadikan Aktif
                              </Button>
                            )}
                          </div>
                          <CardDescription className="text-xs flex items-center gap-1.5 text-muted-foreground mt-0.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {formatDate(ta.tanggal_mulai)} – {formatDate(ta.tanggal_selesai)}
                            </span>
                            <span className="text-muted-foreground/60">•</span>
                            <span>{semesters.length} Semester</span>
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs shadow-sm"
                          onClick={() => handleAddSemester(ta.id_tahun_ajaran)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Tambah Semester
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit Tahun Ajaran"
                          onClick={() => handleEditTA(ta)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Hapus Tahun Ajaran"
                          onClick={() => handleDeleteTA(ta.id_tahun_ajaran, ta.nama)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                      {semesters.length === 0 ? (
                        <div className="text-center py-8 text-xs text-muted-foreground bg-muted/10 rounded-lg border border-dashed flex flex-col items-center justify-center gap-2">
                          <BookOpen className="h-6 w-6 text-muted-foreground/40" />
                          <span>
                            Belum ada semester pada tahun ajaran ini. Klik{" "}
                            <strong className="text-foreground">Tambah Semester</strong> untuk menambahkan.
                          </span>
                        </div>
                      ) : (
                        <div className="rounded-lg border overflow-hidden shadow-xs">
                          <Table>
                            <TableHeader className="bg-muted/40">
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="w-12 text-center text-xs font-semibold text-muted-foreground uppercase">
                                  #
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                                  Nama Semester
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                                  Tanggal Mulai
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                                  Tanggal Selesai
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                                  Status
                                </TableHead>
                                <TableHead className="w-24 text-right text-xs font-semibold text-muted-foreground uppercase">
                                  Aksi
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {semesters.map((sem, idx) => {
                                const today = new Date().toISOString().slice(0, 10);
                                const sStart = sem.tanggal_mulai ? sem.tanggal_mulai.slice(0, 10) : "";
                                const sEnd = sem.tanggal_selesai ? sem.tanggal_selesai.slice(0, 10) : "";
                                const isCurrent = sStart && sEnd && today >= sStart && today <= sEnd;
                                const isPast = sEnd && today > sEnd;

                                return (
                                  <TableRow
                                    key={sem.id_semester}
                                    className="hover:bg-muted/10 transition-colors"
                                  >
                                    <TableCell className="text-center font-medium text-xs text-muted-foreground">
                                      {idx + 1}
                                    </TableCell>
                                    <TableCell className="font-medium text-sm text-foreground">
                                      {sem.nama}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                      {formatDate(sem.tanggal_mulai)}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                      {formatDate(sem.tanggal_selesai)}
                                    </TableCell>
                                    <TableCell>
                                      {ta.is_aktif && isCurrent ? (
                                        <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] font-semibold py-0.5">
                                          Sedang Berjalan
                                        </Badge>
                                      ) : isPast ? (
                                        <Badge variant="secondary" className="text-[10px]">
                                          Selesai
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-[10px]">
                                          Mendatang
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                          title="Edit Semester"
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
                                          title="Hapus Semester"
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
                                );
                              })}
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
