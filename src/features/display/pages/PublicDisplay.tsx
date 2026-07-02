import { useState, useMemo } from "react";
import { useDisplay } from "@/features/display/context/DisplayContext";
import { DisplayHeader } from "@/features/display/components/DisplayHeader";
import { SantriCard } from "@/features/display/components/SantriCard";
import { EmptyState } from "@/features/display/components/EmptyState";
import { SearchBar } from "@/features/display/components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, GraduationCap } from "lucide-react";

function SantriGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/40 bg-card p-4 flex items-center gap-3.5">
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-4 rounded shrink-0" />
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
      </div>
    </div>
  );
}

const PublicDisplay = () => {
  const { santriList, isLoading } = useDisplay();
  const [search, setSearch] = useState("");

  const filteredSantri = useMemo(() => {
    return (santriList || []).filter((s) =>
      s?.nama_santri?.toLowerCase().includes(search.toLowerCase())
    );
  }, [santriList, search]);

  // Calculate unique halaqah count
  const uniqueHalaqah = useMemo(() => {
    const set = new Set((santriList || []).map(s => s.nama_halaqah).filter(Boolean));
    return set.size;
  }, [santriList]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <DisplayHeader />

      <main className="px-4 md:px-8 py-6 md:py-10">
        <div className="mx-auto max-w-5xl space-y-8">

          {/* Hero Section */}
          <div className="text-center space-y-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <GraduationCap className="h-3.5 w-3.5" />
              Portal Publik
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Daftar Santri
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              Cari dan lihat profil, progres hafalan, serta riwayat kehadiran santri.
            </p>
          </div>

          {/* Stats Banner */}
          {!isLoading && santriList.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <StatCard icon={Users} label="Total Santri" value={santriList.length} />
              <StatCard icon={BookOpen} label="Halaqah Aktif" value={uniqueHalaqah} />
              <div className="hidden md:block">
                <StatCard icon={GraduationCap} label="Status" value="Aktif" />
              </div>
            </div>
          )}

          {/* Search */}
          <SearchBar
            value={search}
            onChange={setSearch}
            resultCount={search ? filteredSantri.length : undefined}
            totalCount={santriList?.length || 0}
          />

          {/* Content */}
          {isLoading ? (
            <SantriGridSkeleton />
          ) : filteredSantri.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {filteredSantri.map((santri) => (
                <SantriCard
                  key={santri.id_santri}
                  id={santri.id_santri}
                  nama={santri.nama_santri}
                  halaqah={santri.nama_halaqah}
                  nomorTelepon={santri.nomor_telepon}
                />
              ))}
            </div>
          ) : (
            <EmptyState searchQuery={search} />
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicDisplay;
