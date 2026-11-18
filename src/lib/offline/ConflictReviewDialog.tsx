import React from "react";
import { Button } from "@/components/ui/button";
import { flushOfflineMutations } from "./syncEngine";
import type { OfflineQueuedMutation } from "./mutationQueue";

interface ConflictReviewDialogProps {
  conflictItem: OfflineQueuedMutation;
  onResolved: () => void;
}

export const ConflictReviewDialog: React.FC<ConflictReviewDialogProps> = ({
  conflictItem,
  onResolved,
}) => {
  const handleResolve = async (resolution: "MERGE" | "OVERWRITE" | "DISCARD") => {
    await flushOfflineMutations({
      clientMutationId: conflictItem.client_mutation_id,
      resolution,
    });
    onResolved();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="conflict-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg space-y-4">
        <h2 id="conflict-dialog-title" className="text-lg font-bold text-foreground">
          Konflik Sinkronisasi Offline (Perlu Tinjauan Muhafiz)
        </h2>
        <p className="text-sm text-muted-foreground">
          Data setoran/absensi lokal berbenturan dengan data terbaru di server (atau urutan ayat Ziyadah telah bergeser). Pilih tindakan:
        </p>
        <div className="rounded-lg bg-muted p-3 text-xs font-mono space-y-1">
          <div>ID Mutasi: {conflictItem.client_mutation_id}</div>
          <div>Tipe: {conflictItem.type}</div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => handleResolve("DISCARD")}>
            Batalkan Lokal (Discard)
          </Button>
          <Button variant="secondary" onClick={() => handleResolve("MERGE")}>
            Gabungkan (Merge)
          </Button>
          <Button variant="default" onClick={() => handleResolve("OVERWRITE")}>
            Timpa dengan Audit Log (Overwrite)
          </Button>
        </div>
      </div>
    </div>
  );
};

