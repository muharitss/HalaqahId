import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

// Import Modular Components
import { SantriTable } from "./SantriTable";
import { SantriModal } from "./SantriModal";
import { SantriInfoCard } from "./SantriInfoCard";
import { SantriSkeleton } from "./SantriSkeleton";

// Hooks
import { useSantri } from "@/hooks/useSantri";
import { useAuth } from "@/hooks/useAuth";

export default function KelolaSantriPage() {
  const { isAdmin } = useAuth();
  const { santriList, isLoading, loadSantri, createSantri, updateSantri, deleteSantri } = useSantri();

  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock
  const halaqahList = [{ id_halaqah: 1, nama_halaqah: "Halaqah Al-Fatihah" }];

  useEffect(() => { loadSantri(); }, [loadSantri]);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredSantri = useMemo(() => 
    santriList.filter(s => s.nama_santri.toLowerCase().includes(searchTerm.toLowerCase())),
  [santriList, searchTerm]);

  const handleSaveSantri = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const data: any = Object.fromEntries(formData);
      if (selectedSantri) await updateSantri(selectedSantri.id_santri, data);
      else await createSantri(data);
      showFeedback('success', "Berhasil menyimpan data");
      setIsModalOpen(false);
    } catch (err: any) {
      showFeedback('error', err.message);
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) return <SantriSkeleton />;

  return (
    <div className="space-y-6 container mx-auto py-6 animate-in fade-in duration-500">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Kelola Santri</h2>
          <p className="text-muted-foreground text-sm">Kelola data santri di sini.</p>
        </div>
        <Button onClick={() => { setSelectedSantri(null); setIsModalOpen(true); }} className="gap-2">
          <FontAwesomeIcon icon={faPlus} /> Tambah Santri
        </Button>
      </div>

      {/* 2. Feedback */}
      {feedback && (
        <Alert variant={feedback.type === 'success' ? "default" : "destructive"}>
          <FontAwesomeIcon icon={feedback.type === 'success' ? faCheck : faTimes} className="mr-2" />
          <AlertDescription>{feedback.msg}</AlertDescription>
        </Alert>
      )}

      {/* 3. Search */}
      <div className="relative">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari nama santri..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-10 h-12" 
        />
      </div>
      
      {/* 4. Table */}
      <SantriTable 
        data={filteredSantri} 
        searchTerm={searchTerm} 
        isAdmin={isAdmin()} 
        halaqahList={halaqahList}
        onEdit={(s: any) => { setSelectedSantri(s); setIsModalOpen(true); }}
        onDelete={deleteSantri}
      />

      {/* 5. Info Card */}
      <SantriInfoCard />

      {/* 6. Modal */}
      <SantriModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveSantri}
        selectedSantri={selectedSantri}
        isAdmin={isAdmin()}
        halaqahList={halaqahList}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}