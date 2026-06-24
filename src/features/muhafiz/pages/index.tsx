import { useAuth } from "@/features/auth/components/auth-provider";
import { CardContent } from "@/components/ui/card";
import { MuhafizManagement } from "@/components/custom/typed-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCalendarCheck, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Hooks & Components
import { useMuhafiz } from "../hooks/useMuhafiz";
import { BuatAkun } from "../components/BuatAkun";
import { DaftarAkun } from "../components/DaftarAkun";
import { EditAkun } from "../components/EditAkun";
import { DeleteAkun } from "../components/DeleteAkun";
import { RekapAbsensiAsatidz } from "../components/RekapAbsensiAsatidz";
import { InputAbsensiAsatidz } from "../components/InputAbsensiAsatidz";
import { AccessDenied } from "../components/AccessDenied";
import { isKepalaRole } from "@/types/domain/enums";

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

  if (!user || !isKepalaRole(user.role)) return <AccessDenied />;

  const filteredMuhafizList = muhafizList.filter((m) => {
    if (!selectedSesi) return true;
    return m.halaqah?.sesi_halaqahs?.some((s) => s.id_sesi === selectedSesi) ?? false;
  });

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
          <CardContent className="p-0 border rounded-xl overflow-hidden bg-card shadow-sm">
            <DaftarAkun
              muhafizList={muhafizList}
              activeMuhafizIds={activeMuhafizIds}
              isLoading={isLoading}
              onEditClick={openEditModal}
              onDeleteClick={openDeleteModal}
              onImpersonateClick={handleImpersonate}
              onAbsenMuhafiz={handleAbsenMuhafiz} 
              onCreateClick={handleCreateSuccess}
            />
          </CardContent>
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
                {sesiList.map((sesi) => (
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
