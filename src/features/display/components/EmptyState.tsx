interface EmptyStateProps {
  searchQuery: string;
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="col-span-full text-center py-20 bg-card rounded-xl border-2 border-dashed border-muted">
      <p className="text-muted-foreground italic">
        Santri "{searchQuery}" tidak ditemukan.
      </p>
    </div>
  );
}