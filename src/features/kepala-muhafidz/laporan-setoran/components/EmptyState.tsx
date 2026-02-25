import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import type { EmptyStateProps } from "../types";

export function EmptyState({ isFilterActive }: EmptyStateProps) {
  return (
    <Card className="border-dashed flex flex-col items-center justify-center p-16 text-center bg-muted/20">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold">Data Tidak Ditemukan</h3>
      <p className="text-sm text-muted-foreground max-w-xs mt-1">
        {isFilterActive 
          ? "Tidak ada setoran untuk periode ini." 
          : "Database setoran masih kosong."}
      </p>
    </Card>
  );
}