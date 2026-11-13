import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DaftarHalaqahProps, Halaqah } from "@/features/halaqah/types";
import { HalaqahListPanel } from "./HalaqahListPanel";
import { SantriListPanel } from "./SantriListPanel";

export function DaftarHalaqah({
  halaqahs,
  santriMap,
  isLoading,
  selectedHalaqah,
  onSelectHalaqah,
  onAddSantri,
  onEdit,
  onDelete,
  onMoveSantri,
  onEditSantri,
  onDeleteSantri,
  onManageMuhafiz,
}: DaftarHalaqahProps) {
  const [internalSelectedHalaqah, setInternalSelectedHalaqah] = useState<Halaqah | null>(null);

  if (isLoading) {
    return <HalaqahLoadingSkeleton />;
  }

  // Use provided selectedHalaqah or internal selection; fallback to first halaqah
  const activeHalaqah =
    (selectedHalaqah !== undefined && selectedHalaqah !== null
      ? halaqahs.find((h) => h.id_halaqah === selectedHalaqah.id_halaqah) || selectedHalaqah
      : internalSelectedHalaqah) ||
    halaqahs[0] ||
    null;

  const handleSelectHalaqah = (h: Halaqah) => {
    setInternalSelectedHalaqah(h);
    onSelectHalaqah?.(h);
  };

  const activeSantriList = activeHalaqah ? santriMap[activeHalaqah.id_halaqah] || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 xl:col-span-4">
        <HalaqahListPanel
          halaqahs={halaqahs}
          selectedHalaqahId={activeHalaqah?.id_halaqah}
          santriMap={santriMap}
          onSelectHalaqah={handleSelectHalaqah}
          onAddSantri={onAddSantri}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageMuhafiz={onManageMuhafiz}
        />
      </div>

      <div className="lg:col-span-7 xl:col-span-8">
        <SantriListPanel
          selectedHalaqah={activeHalaqah}
          santriList={activeSantriList}
          onAddSantri={onAddSantri}
          onManageMuhafiz={onManageMuhafiz}
          onMoveSantri={onMoveSantri}
          onEditSantri={onEditSantri}
          onDeleteSantri={onDeleteSantri}
        />
      </div>
    </div>
  );
}

function HalaqahLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 xl:col-span-4 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-18 w-full rounded-xl" />
        ))}
      </div>
      <div className="lg:col-span-7 xl:col-span-8">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
