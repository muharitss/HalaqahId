import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faExclamationTriangle, faInbox } from "@fortawesome/free-solid-svg-icons";

// Import Modular Components
import { SantriTable } from "./SantriTable";
import { SantriModal } from "./SantriModal";
import { SantriInfoCard } from "./SantriInfoCard";
import { SantriSkeleton } from "./SantriSkeleton";

import { useSantri } from "@/hooks/useSantri";
import { halaqahService } from "@/services/halaqahService";
import { santriSchema } from "@/utils/zodSchema";
import z from "zod";
import { useAuth } from "@/context/AuthContext";

export default function KelolaSantriPage() {
  const { isAdmin } = useAuth();
  const { santriList, isLoading, error, loadSantri, createSantri, updateSantri, deleteSantri } = useSantri();

  const [_feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [halaqahs, setHalaqahs] = useState<any[]>([]);
  const [searchTerm, _setSearchTerm] = useState("");

  useEffect(() => {
    loadSantri();
    const fetchHalaqahs = async () => {
      try {
        const res = await halaqahService.getAllHalaqah();
        setHalaqahs(res.data);
      } catch (e) {
        console.error("Gagal load halaqah");
      }
    };
    if (isAdmin()) fetchHalaqahs();
  }, [loadSantri, isAdmin]);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredSantri = useMemo(() => 
    santriList.filter(s => s.nama_santri.toLowerCase()),
  [santriList]);

  const handleSaveSantri = async (data: any) => { 
    setIsSubmitting(true); 
    try {
      const validatedData = santriSchema.parse(data) as any;

      if (selectedSantri) {
        await updateSantri(selectedSantri.id_santri, validatedData);
        showFeedback('success', 'Berhasil memperbarui data');
      } else {
        await createSantri(validatedData);
        showFeedback('success', 'Berhasil menambah santri');
      }
      
      setIsModalOpen(false);
      loadSantri();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Ini akan memunculkan pesan error dari Zod (misal: "Nomor telepon minimal 10 digit")
        showFeedback('error', err.issues[0].message);
      } else {
        showFeedback('error', err.message || "Terjadi kesalahan server");
      }
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-xl bg-muted/30">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <FontAwesomeIcon 
          icon={error?.includes("belum memiliki halaqah") ? faExclamationTriangle : faInbox} 
          className="text-3xl text-primary" 
        />
      </div>
      <h3 className="text-lg font-semibold">
        {error?.includes("belum memiliki halaqah") ? "Halaqah Belum Ditugaskan" : "Belum Ada Santri"}
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mt-2">
        {error?.includes("belum memiliki halaqah") 
          ? "Akun Anda saat ini belum terhubung dengan halaqah manapun. Silahkan hubungi Admin untuk proses penugasan." 
          : "Data santri tidak ditemukan atau belum ditambahkan ke halaqah ini."}
      </p>
      {!error && (
        <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-6">
          Tambah Santri Pertama
        </Button>
      )}
    </div>
  );

  if (isLoading) return <SantriSkeleton />;

  return (
    <div className="space-y-6 container mx-auto py-6 animate-in fade-in duration-500">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Kelola Santri</h2>
          <p className="text-muted-foreground text-sm">Kelola data santri di sini.</p>
        </div>
        {!error && (
            <Button onClick={() => { setSelectedSantri(null); setIsModalOpen(true); }} className="gap-2">
                <FontAwesomeIcon icon={faPlus} /> Tambah Santri
            </Button>
        )}
      </div>

      {/* 2. Feedback */}
      {error && (
        <Alert variant="destructive">
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          <AlertDescription>
            {error.includes("belum memiliki halaqah") 
              ? "Akun Anda belum ditugaskan ke halaqah manapun. Silahkan hubungi Admin." 
              : error}
          </AlertDescription>
        </Alert>
      )}

      {santriList.length > 0 ? (
        <>
          <SantriTable 
            data={filteredSantri} 
            isAdmin={isAdmin()} 
            halaqahList={halaqahs}
            onEdit={(s: any) => { setSelectedSantri(s); setIsModalOpen(true); }}
            searchTerm={searchTerm}
            onDelete={(s: any) => deleteSantri(s.id_santri)}
          />
        </>
      ) : (
        <EmptyState />
      )}

      {/* 5. Info Card */}
      <SantriInfoCard />

      {/* 6. Modal */}
      <SantriModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveSantri}
        selectedSantri={selectedSantri}
        isAdmin={isAdmin()}
        halaqahList={halaqahs}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}