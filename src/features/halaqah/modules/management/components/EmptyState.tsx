import { Users } from "lucide-react";
import type { EmptyStateProps } from "@/features/halaqah/types";

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl opacity-50">
      <Users className="h-12 w-12 mb-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
