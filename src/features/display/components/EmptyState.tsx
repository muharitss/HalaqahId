import { SearchX, Users } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  const isSearching = searchQuery.length > 0;

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-6">
      <div className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
        {isSearching ? (
          <SearchX className="h-8 w-8 text-muted-foreground/50" />
        ) : (
          <Users className="h-8 w-8 text-muted-foreground/50" />
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        {isSearching ? "Tidak ditemukan" : "Belum ada data"}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {isSearching
          ? `Santri dengan nama "${searchQuery}" tidak ditemukan. Coba gunakan kata kunci lain.`
          : "Data santri belum tersedia untuk sekolah ini."}
      </p>
    </div>
  );
}
