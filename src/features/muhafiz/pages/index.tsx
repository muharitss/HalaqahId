import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/components/auth-provider";
import { MuhafizManagement } from "@/components/custom/typed-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCalendarCheck, faClipboardList, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Hooks & Components
import { useMuhafiz, BuatAkun, DaftarAkun, EditAkun, DeleteAkun, RekapAbsensiAsatidz, InputAbsensiAsatidz } from "../modules";
import { AccessDenied } from "../components/AccessDenied";
import { isKepalaRole } from "@/types/domain/enums";
import { type Muhafiz } from "../types";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";

export default function KelolaMuhafizPage() {
  const { user } = useAuth();
  const {
    muhafizList,
    activeMuhafizIds,
    isLoading,
    editingMuhafiz,
    deletingMuhafiz,
    isEditOpen,
    isDeleteOpen,
    openEditModal,
    openDeleteModal,
    closeEditModal,
    closeDeleteModal,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleImpersonate,

    // Absensi States & Actions
    selectedDate,
    setSelectedDate,
    selectedSesi,
    setSelectedSesi,
    sesiList,
    attendanceMap,
    submittedAttendance,
    handleStatusChange,
    handleSaveAllAbsensi,
    isSubmitting,
    handleAbsenMuhafiz,
  } = useMuhafiz();

  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (!user || !isKepalaRole(user.role)) return <AccessDenied />;

  const filteredMuhafizList = useMemo(() => {
    return muhafizList.filter((m: Muhafiz) => {
      if (!selectedSesi) return true;
      return m.halaqah?.sesi_halaqahs?.some((s: { id_sesi: number }) => s.id_sesi === selectedSesi) ?? false;
    });
  }, [muhafizList, selectedSesi]);

  const filteredMuhafiz = useMemo(() => {
    return muhafizList.filter((m: Muhafiz) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [muhafizList, searchTerm]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredMuhafiz.length / 10)), [filteredMuhafiz.length]);
  const displayedMuhafiz = useMemo(() => {
    return showAll
      ? filteredMuhafiz
      : filteredMuhafiz.slice((currentPage - 1) * 10, currentPage * 10);
  }, [filteredMuhafiz, showAll, currentPage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <MuhafizManagement />
        </div>
        <div className="shrink-0">
          <BuatAkun onSuccess={handleCreateSuccess} />
        </div>
      </div>

      <Tabs defaultValue="daftar" className="w-full space-y-6">
        <TabsList className="flex w-full items-center justify-start overflow-x-auto overflow-y-hidden bg-muted/50 p-1 md:grid md:grid-cols-3 md:max-w-[550px] scrollbar-hide h-auto">
          <TabsTrigger value="daftar" className="flex items-center gap-2 shrink-0 whitespace-nowrap py-2 px-4 md:px-2">
            <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5" />
            <span>Daftar Akun</span>
          </TabsTrigger>
          <TabsTrigger value="input" className="flex items-center gap-2 shrink-0 whitespace-nowrap py-2 px-4 md:px-2">
            <FontAwesomeIcon icon={faClipboardList} className="h-3.5 w-3.5" />
            <span>Input Absensi</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2 shrink-0 whitespace-nowrap py-2 px-4 md:px-2">
            <FontAwesomeIcon icon={faCalendarCheck} className="h-3.5 w-3.5" />
            <span>Monitoring</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DAFTAR AKUN */}
        <TabsContent value="daftar" className="mt-0 outline-none">
          <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
            <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-72">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama atau email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <DaftarAkun
              muhafizList={displayedMuhafiz}
              activeMuhafizIds={activeMuhafizIds}
              isLoading={isLoading}
              onEditClick={openEditModal}
              onDeleteClick={openDeleteModal}
              onImpersonateClick={handleImpersonate}
              onAbsenMuhafiz={handleAbsenMuhafiz} 
              onCreateClick={handleCreateSuccess}
            />

            {/* Pagination Section */}
            {!isLoading && (filteredMuhafiz.length > 10 || showAll) && (
              <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                <div className="text-xs text-muted-foreground">
                  {showAll ? (
                    <span>Menampilkan semua <strong>{filteredMuhafiz.length}</strong> muhafidz</span>
                  ) : (
                    <span>
                      Menampilkan <strong>{Math.min((currentPage - 1) * 10 + 1, filteredMuhafiz.length)}</strong> -{" "}
                      <strong>{Math.min(currentPage * 10, filteredMuhafiz.length)}</strong> dari{" "}
                      <strong>{filteredMuhafiz.length}</strong> muhafidz
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
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: INPUT ABSENSI (100% IDENTIK LAYOUTNYA) */}
        <TabsContent value="input" className="space-y-6 mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
            <Select
              value={selectedSesi ? selectedSesi.toString() : ""}
              onValueChange={(val) => setSelectedSesi(Number(val))}
              disabled={isLoading || sesiList.length === 0}
            >
              <SelectTrigger className="w-full md:w-60 border-primary/20 hover:border-primary">
                <SelectValue placeholder="Pilih Sesi" />
              </SelectTrigger>
              <SelectContent>
                {sesiList.map((sesi: SesiHalaqah) => (
                  <SelectItem key={sesi.id_sesi} value={sesi.id_sesi.toString()}>
                    {sesi.nama_sesi} ({sesi.jam_mulai} - {sesi.jam_selesai})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-60 justify-start text-left font-normal border-primary/20 hover:border-primary">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {format(new Date(selectedDate), "dd MMMM yyyy", { locale: id })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={new Date(selectedDate)}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      setSelectedDate(`${year}-${month}-${day}`);
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="min-h-75">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <InputAbsensiAsatidz
                muhafizList={filteredMuhafizList}
                attendanceMap={attendanceMap}
                submittedAttendance={submittedAttendance} 
                onStatusChange={handleStatusChange}
              />
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <p className="text-sm text-muted-foreground italic">
              * Pastikan semua data benar. Klik status kembali untuk mengubah absensi yang sudah tercatat.
            </p>
            <Button 
              onClick={handleSaveAllAbsensi} 
              disabled={isSubmitting || isLoading || muhafizList.length === 0}
              className="px-10 h-11"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan / Update Absensi"}
            </Button>
          </div>
        </TabsContent>

        {/* TAB 3: REKAP */}
        <TabsContent value="monitoring" className="space-y-6 mt-0">
          <RekapAbsensiAsatidz muhafizList={muhafizList} sesiList={sesiList} />
        </TabsContent>
      </Tabs>

      {/* MODALS */}
      <EditAkun muhafiz={editingMuhafiz} isOpen={isEditOpen} onClose={closeEditModal} onSuccess={handleEditSuccess} />
      <DeleteAkun muhafiz={deletingMuhafiz} isOpen={isDeleteOpen} onClose={closeDeleteModal} onSuccess={handleDeleteSuccess} />
    </div>
  );
}
