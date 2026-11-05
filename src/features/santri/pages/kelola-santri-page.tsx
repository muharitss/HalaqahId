import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { halaqahManagementService } from "@/features/halaqah/api/halaqahManagementService";
import { type Halaqah } from "@/features/halaqah/types";
import { useSantri, SantriTable, SantriModal } from "../modules";
import type { Santri, CreateSantriData, UpdateSantriData, StatusSantri } from "../types";
import { useAuth } from "@/features/auth/components/auth-provider";
import { Role } from "@/types/domain/enums";
import { useTour } from "@/hooks/useTour";
import { type DriveStep } from "driver.js";
import { HelpCircle, Users, Plus, Search, Filter } from "lucide-react";

import { KelolaSantri } from "@/components/custom/typed-text";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";
import { PermissionGate } from "@/components/ui/PermissionGate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SantriWaliSection } from "../components/SantriWaliSection";
import { SantriDetailModal } from "../components/SantriDetailModal";
import { PindahHalaqahDialog } from "../components/PindahHalaqahDialog";

export function KelolaSantriPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === Role.SUPERADMIN || user?.role === Role.ADMIN || user?.role === Role.KOORDINATOR_TAHFIZ;
  
  const { santriList, isLoading, createSantri, updateSantri, deleteSantri } = useSantri();
  const labelSantri = useTerminology("SANTRI");
  const labelHalaqah = useTerminology("HALAQAH");

  // Halaqah list for filtering & relations
  const { data: halaqahList = [] } = useQuery<Halaqah[]>({
    queryKey: ["halaqah", "all-list"],
    queryFn: async () => {
      try {
        return await halaqahManagementService.getAllHalaqah();
      } catch {
        return [];
      }
    },
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // Detail & Riwayat modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSantriForDetail, setSelectedSantriForDetail] = useState<Santri | null>(null);

  // Pindah halaqah dialog state
  const [isPindahDialogOpen, setIsPindahDialogOpen] = useState(false);
  const [selectedSantriForPindah, setSelectedSantriForPindah] = useState<Santri | null>(null);

  // Wali dialog standalone state
  const [isWaliModalOpen, setIsWaliModalOpen] = useState(false);
  const [selectedSantriForWali, setSelectedSantriForWali] = useState<Santri | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const steps: DriveStep[] = [
    {
      element: '[data-tour="kelola-santri-header"]',
      popover: {
        title: `Kelola ${labelSantri}`,
        description: `lihat dan kelola daftar ${labelSantri.toLowerCase()} aktif di ${labelHalaqah.toLowerCase()} Anda.`,
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-tour="kelola-santri-add-btn"]',
      popover: {
        title: `Tambah ${labelSantri} Baru`,
        description: `daftarkan ${labelSantri.toLowerCase()} baru ke ${labelHalaqah.toLowerCase()} Anda dan tentukan nama, NIS, nomor telepon orang tua, dan target hafalan.`,
        side: "bottom",
        align: "end"
      }
    },
    {
      element: '[data-tour="kelola-santri-search-bar"]',
      popover: {
        title: `Cari Nama & NIS ${labelSantri}`,
        description: `Ketikkan nama atau NIS ${labelSantri.toLowerCase()} di sini untuk menyaring tabel secara instan.`,
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-tour="kelola-santri-table"]',
      popover: {
        title: `Tabel Data ${labelSantri} `,
        description: `Menampilkan NIS, profil ${labelSantri.toLowerCase()}, status, nama ${labelHalaqah.toLowerCase()}, target aktif, serta opsi aksi.`,
        side: "top",
        align: "center"
      }
    }
  ];

  const { restartTour } = useTour({
    tourKey: "tour_kelola_santri",
    steps,
    userId: user?.id_user,
    autoStart: true,
    ready: !isLoading
  });

  // Reset page when search term or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredSantri = useMemo(
    () =>
      santriList.filter((s: Santri) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          s.nama_santri.toLowerCase().includes(query) ||
          (s.nomor_induk_santri && s.nomor_induk_santri.toLowerCase().includes(query)) ||
          (s.nomor_telepon && s.nomor_telepon.includes(query));
        const matchesStatus =
          statusFilter === "ALL" || (s.status ?? "AKTIF") === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [santriList, searchTerm, statusFilter]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredSantri.length / 10)),
    [filteredSantri.length]
  );

  const displayedSantri = useMemo(
    () =>
      showAll
        ? filteredSantri
        : filteredSantri.slice((currentPage - 1) * 10, currentPage * 10),
    [filteredSantri, showAll, currentPage]
  );

  const handleEdit = useCallback((santri: Santri) => {
    setSelectedSantri(santri);
    setIsModalOpen(true);
  }, []);

  const handleViewDetail = useCallback((santri: Santri) => {
    setSelectedSantriForDetail(santri);
    setIsDetailModalOpen(true);
  }, []);

  const handlePindahHalaqah = useCallback((santri: Santri) => {
    setSelectedSantriForPindah(santri);
    setIsPindahDialogOpen(true);
  }, []);

  const handleManageWali = useCallback((santri: Santri) => {
    setSelectedSantriForWali(santri);
    setIsWaliModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (santri: Santri) => {
      if (confirm(`Yakin ingin menghapus ${labelSantri.toLowerCase()} ${santri.nama_santri}?`)) {
        await deleteSantri(santri.id_santri);
      }
    },
    [deleteSantri, labelSantri]
  );

  const handleSave = async (data: {
    nama_santri: string;
    nomor_induk_santri?: string | null;
    status?: StatusSantri;
    nomor_telepon?: string | null;
    id_target: number | null;
    id_halaqah: number | undefined;
  }) => {
    const payload: CreateSantriData = {
      nama_santri: data.nama_santri,
      nomor_induk_santri: data.nomor_induk_santri || null,
      status: data.status || "AKTIF",
      nomor_telepon: data.nomor_telepon || "",
      id_target: data.id_target,
      id_halaqah: data.id_halaqah || 0,
    };
    if (selectedSantri) {
      await updateSantri(selectedSantri.id_santri, payload as UpdateSantriData);
    } else {
      await createSantri(payload);
    }
    setIsModalOpen(false);
    setSelectedSantri(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSantri(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8" data-tour="kelola-santri-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <KelolaSantri />
            <Button
              onClick={restartTour}
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary rounded-full"
              title={`Mulai Panduan Kelola ${labelSantri}`}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <PermissionGate permission="santri.create">
          <div className="shrink-0" data-tour="kelola-santri-add-btn">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah <Term code="SANTRI" />
            </Button>
          </div>
        </PermissionGate>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72" data-tour="kelola-santri-search-bar">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder={`Cari nama atau NIS ${labelSantri.toLowerCase()}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="AKTIF">Aktif</SelectItem>
                  <SelectItem value="LULUS">Lulus</SelectItem>
                  <SelectItem value="KELUAR">Keluar</SelectItem>
                  <SelectItem value="CUTI">Cuti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div data-tour="kelola-santri-table">
          <SantriTable 
            data={displayedSantri}
            searchTerm={searchTerm}
            isAdmin={isAdmin}
            halaqahList={halaqahList} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
            onPindahHalaqah={handlePindahHalaqah}
            onManageWali={handleManageWali}
          />
        </div>

        {/* Pagination Section */}
        {filteredSantri.length > 10 && (
          <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
            <div className="text-xs text-muted-foreground">
              {showAll ? (
                <span>Menampilkan semua <strong>{filteredSantri.length}</strong> {labelSantri.toLowerCase()}</span>
              ) : (
                <span>
                  Menampilkan <strong>{Math.min((currentPage - 1) * 10 + 1, filteredSantri.length)}</strong> -{" "}
                  <strong>{Math.min(currentPage * 10, filteredSantri.length)}</strong> dari{" "}
                  <strong>{filteredSantri.length}</strong> {labelSantri.toLowerCase()}
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

      {/* Modal Tambah / Edit Santri */}
      <SantriModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        selectedSantri={selectedSantri}
        isAdmin={isAdmin}
        halaqahList={halaqahList}
        isSubmitting={isLoading}
        onPindahHalaqahClick={handlePindahHalaqah}
      />

      {/* Modal Detail & Riwayat Santri */}
      <SantriDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSantriForDetail(null);
        }}
        santri={selectedSantriForDetail}
        halaqahList={halaqahList}
        onEditClick={(santri) => {
          setIsDetailModalOpen(false);
          handleEdit(santri);
        }}
        onPindahHalaqahClick={(santri) => {
          setIsDetailModalOpen(false);
          handlePindahHalaqah(santri);
        }}
      />

      {/* Dialog Pindah Halaqah */}
      <PindahHalaqahDialog
        isOpen={isPindahDialogOpen}
        onClose={() => {
          setIsPindahDialogOpen(false);
          setSelectedSantriForPindah(null);
        }}
        santri={selectedSantriForPindah}
        halaqahList={halaqahList}
      />

      {/* Dialog Kelola Wali Standalone */}
      <Dialog
        open={isWaliModalOpen}
        onOpenChange={(open) => {
          setIsWaliModalOpen(open);
          if (!open) setSelectedSantriForWali(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Kelola Data Wali &mdash; {selectedSantriForWali?.nama_santri}
            </DialogTitle>
            <DialogDescription>
              Daftar orang tua atau wali untuk {labelSantri.toLowerCase()} ini.
            </DialogDescription>
          </DialogHeader>
          {selectedSantriForWali && (
            <SantriWaliSection
              santriId={selectedSantriForWali.id_santri}
              santriName={selectedSantriForWali.nama_santri}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
