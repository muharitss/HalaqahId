import { useState, useEffect, useMemo, useCallback } from "react";
import { SantriInfoCard } from "./SantriInfoCard";
import { SantriSkeleton } from "./SantriSkeleton";
import { useSantri } from "@/hooks/useSantri";
import type { Santri } from '@/services/santriService';
import { halaqahService } from '@/services/halaqahService';
import type { Halaqah } from '@/services/halaqahService';
import { getErrorMessage } from "@/utils/error";

import { santriSchema } from "@/utils/zodSchema";
import z from "zod";
import { SantriTable } from "./SantriTable";
import { SantriModal } from "./SantriModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faInbox } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";

export default function KelolaSantriPage() {
  const { isAdmin } = useAuth();
  const { 
    santriList, 
    loadSantri, 
    createSantri, 
    updateSantri, 
    deleteSantri,
    isLoading 
  } = useSantri();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchHalaqahs = useCallback(async () => {
    try {
      const res = await halaqahService.getAllHalaqah();
      setHalaqahs(res.data);
    } catch (err: unknown) {
      console.error(getErrorMessage(err, "Gagal mengambil data halaqah"));
    }
  }, []);

  useEffect(() => {
    loadSantri();
    if (isAdmin()) {
      fetchHalaqahs();
    }
  }, [isAdmin, loadSantri, fetchHalaqahs]);


  const filteredSantri = useMemo(() => {
    return santriList.filter((s) => 
      s.nama_santri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomor_telepon.includes(searchTerm)
    );
  }, [santriList, searchTerm]);


  const handleSaveSantri = async (data: unknown) => { 
    setIsSubmitting(true); 
    try {
      const validatedData = santriSchema.parse(data);

      if (selectedSantri) {
        await updateSantri(selectedSantri.id_santri, {
          ...validatedData,
          halaqah_id: validatedData.halaqah_id ?? selectedSantri.halaqah_id
        });
        showFeedback('success', 'Berhasil memperbarui data');
      } else {
        await createSantri({
          nama_santri: validatedData.nama_santri,
          nomor_telepon: validatedData.nomor_telepon,
          target: validatedData.target,
          halaqah_id: validatedData.halaqah_id || 0
        });
        showFeedback('success', 'Berhasil menambah santri');
      }
      
      setIsModalOpen(false);
      loadSantri();
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        showFeedback('error', err.issues[0].message);
      } else {
        showFeedback('error', getErrorMessage(err, "Gagal memproses data santri"));
      }
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleEdit = (santri: Santri) => {
    setSelectedSantri(santri);
    setIsModalOpen(true);
  };

  const handleDelete = async (santri: Santri) => {
    if (!confirm(`Hapus santri ${santri.nama_santri}?`)) return;

    try {
      await deleteSantri(santri.id_santri);
      showFeedback('success', 'Berhasil menghapus santri');
    } catch (err: unknown) {
      showFeedback('error', getErrorMessage(err, 'Gagal menghapus santri'));
    }
  };

  const handleAddNew = () => {
    setSelectedSantri(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Santri</h1>
          <p className="text-muted-foreground">Manajemen data santri dan kelompok halaqah</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Tambah Santri
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-md flex items-center ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <FontAwesomeIcon icon={feedback.type === 'success' ? faTimes : faTimes} className="mr-2" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {isLoading && santriList.length === 0 ? (
        <SantriSkeleton />
      ) : (
        <div className="grid gap-6">
          <SantriInfoCard />
          
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Cari santri..."
                className="w-full max-w-sm px-3 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredSantri.length > 0 ? (
              <SantriTable 
                data={filteredSantri} 
                searchTerm={searchTerm}
                isAdmin={isAdmin()}
                halaqahList={halaqahs}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-xl bg-muted/30">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <FontAwesomeIcon icon={faInbox} className="text-3xl text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Belum Ada Santri</h3>
                <p className="text-muted-foreground text-center max-w-sm mt-2">
                  Data santri tidak ditemukan atau belum ditambahkan ke halaqah ini.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <SantriModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSantri}
        selectedSantri={selectedSantri}
        isSubmitting={isSubmitting}
        isAdmin={isAdmin()}
        halaqahList={halaqahs}
      />

    </div>
  );
}