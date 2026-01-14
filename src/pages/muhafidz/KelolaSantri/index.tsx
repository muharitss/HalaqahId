import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

// Import Komponen Modular
import { SantriStats } from "./SantriStats";
import { SantriTable } from "./SantriTable";
import { SantriInfoCard } from "./SantriInfoCard";
import { SantriSkeleton } from "./SantriSkeleton";
import { SantriModal } from "./SantriModal";

interface Santri {
  id_santri: number;
  nama: string;
  target: "RINGAN" | "SEDANG" | "INTENS" | "CUSTOM_KHUSUS";
  halaqah_id: number;
}

export default function KelolaSantriPage() {
  // --- States ---
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  // State untuk Modal (Tambah/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // --- Load Data ---
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setSantriList([
          { id_santri: 1, nama: "Ahmad Farhan", target: "SEDANG", halaqah_id: 1 },
          { id_santri: 2, nama: "Zaid Ramadhan", target: "INTENS", halaqah_id: 1 },
          { id_santri: 3, nama: "Umar Mukhtar", target: "RINGAN", halaqah_id: 1 },
        ]);
        setIsLoading(false);
      }, 1000);
    };
    loadData();
  }, []);

  // --- Helper Functions ---
  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredSantri = useMemo(() => 
    santriList.filter(s => s.nama.toLowerCase().includes(searchTerm.toLowerCase())),
  [santriList, searchTerm]);

  // --- Handlers ---
  const handleOpenAddModal = () => {
    setSelectedSantri(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (santri: Santri) => {
    setSelectedSantri(santri);
    setIsModalOpen(true);
  };

  const handleSaveSantri = (data: Partial<Santri>) => {
    if (selectedSantri) {
      // Logic Update (Simulasi)
      setSantriList(prev => prev.map(s => 
        s.id_santri === selectedSantri.id_santri ? { ...s, ...data } : s
      ));
      showFeedback('success', `Berhasil memperbarui data ${data.nama}`);
    } else {
      // Logic Create (Simulasi ID)
      const newSantri = { ...data, id_santri: Date.now() } as Santri;
      setSantriList(prev => [...prev, newSantri]);
      showFeedback('success', `Berhasil menambah santri ${data.nama}`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSantri = (santri: Santri) => {
    if (confirm(`Hapus santri ${santri.nama}?`)) {
      setSantriList(prev => prev.filter(s => s.id_santri !== santri.id_santri));
      showFeedback('success', "Santri berhasil dihapus");
    }
  };

  // --- View Logic ---
  if (isLoading) return <SantriSkeleton />;

  return (
    <div className="space-y-6 container mx-auto py-6 animate-in fade-in duration-500">
      
      {/* 1. Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Kelola Santri</h2>
          <p className="text-muted-foreground text-sm">Kelola data santri di halaqah Anda</p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-primary">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> 
          Tambah Santri
        </Button>
      </div>

      {/* 2. Feedback Alert */}
      {feedback && (
        <Alert variant={feedback.type === 'success' ? "default" : "destructive"} 
               className={feedback.type === 'success' ? "bg-green-50 border-green-200 text-green-800" : ""}>
          <FontAwesomeIcon icon={feedback.type === 'success' ? faCheck : faTimes} className="mr-2" />
          <AlertDescription>{feedback.msg}</AlertDescription>
        </Alert>
      )}

      {/* 3. Search Bar */}
      <div className="relative">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari nama santri..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-10 h-12" 
        />
      </div>

      {/* 4. Stats Cards */}
      <SantriStats santriList={santriList} />
      
      {/* 5. Main Table (Shadcn) */}
      <SantriTable 
        data={filteredSantri} 
        totalData={santriList.length} 
        searchTerm={searchTerm}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteSantri}
        onAddClick={handleOpenAddModal}
      />

      {/* 6. Info Card & Footer */}
      <SantriInfoCard />

      {/* 7. Dialog Form (Shadcn) */}
      <SantriModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSantri}
        editingSantri={selectedSantri}
      />
      
    </div>
  );
}