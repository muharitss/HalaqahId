import { useState } from "react";
import { useDisplay } from "@/features/display/context/DisplayContext";
import { Spinner } from "@/components/ui/spinner";
import { DisplayHeader } from "@/features/display/components/DisplayHeader";
import { SantriCard } from "@/features/display/components/SantriCard";  
import { EmptyState } from "@/features/display/components/EmptyState";
import { SearchBar } from "@/features/display/components/SearchBar";

const PublicDisplay = () => {
  const { santriList, isLoading } = useDisplay();
  const [search, setSearch] = useState("");

  const filteredSantri = (santriList || []).filter((s) =>
    s?.nama_santri?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-5xl space-y-8">
        
        <DisplayHeader />

        <div className="text-center space-y-2 pt-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary uppercase">
            Portal Informasi Santri
          </h1>
          <p className="text-muted-foreground">
            Cari nama santri untuk melihat detail progres dan absensi.
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSantri.length > 0 ? (
            filteredSantri.map((santri) => (
              <SantriCard
                key={santri.id_santri}
                id={santri.id_santri}
                nama={santri.nama_santri}
                halaqah={santri.nama_halaqah}
              />
            ))
          ) : (
            <EmptyState searchQuery={search} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicDisplay;