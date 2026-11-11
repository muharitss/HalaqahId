import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/components/auth-provider";
import { isKepalaRole } from "@/types/domain/enums";

import { useSOPConfig, SOPEmptyState, SOPSectionCard, SOPBuilderPanel } from "../modules";

export default function InfoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canEdit = user ? isKepalaRole(user.role) : false;
  const basePath = user && isKepalaRole(user.role)
    ? "/kepala-muhafidz/settings"
    : "/muhafidz/settings";

  const [isEditing, setIsEditing] = useState(false);

  const {
    config,
    isLoading,
    saveStatus,
    error,
    save,
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    addItem,
    updateItem,
    deleteItem,
    addContentLine,
    updateContentLine,
    removeContentLine,
    changeItemType,
  } = useSOPConfig();

  const hasContent = (config?.sections.length ?? 0) > 0;

  function handleSave() {
    if (!config) return;
    save(config);
  }

  function handleCreateFirst() {
    setIsEditing(true);
    addSection();
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(basePath)}
            className="rounded-full h-9 w-9 shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-0">
              Informasi &amp; SOP
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-0">
              Standar Operasional Prosedur khusus untuk manajemen halaqah ini.
            </p>
          </div>
        </div>
        {canEdit && hasContent && !isLoading && (
          <div className="flex items-center gap-2">
            <Button
              variant={isEditing ? "secondary" : "outline"}
              size="sm"
              className="gap-2 text-xs shrink-0 shadow-sm"
              onClick={() => setIsEditing((v) => !v)}
            >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                Lihat Preview
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                Edit SOP
              </>
            )}
            </Button>
          </div>
        )}
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center space-y-2">
          <p className="text-sm text-destructive font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : isEditing && canEdit ? (
        /* ── EDIT MODE ──────────────────────────────────────────────────── */
        <SOPBuilderPanel
          config={config ?? { sections: [] }}
          saveStatus={saveStatus}
          onSave={handleSave}
          onAddSection={addSection}
          onUpdateSection={updateSection}
          onDeleteSection={deleteSection}
          onMoveSectionUp={moveSectionUp}
          onMoveSectionDown={moveSectionDown}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          onAddContentLine={addContentLine}
          onUpdateContentLine={updateContentLine}
          onRemoveContentLine={removeContentLine}
          onChangeItemType={changeItemType}
        />
      ) : hasContent ? (
        /* ── VIEW MODE ──────────────────────────────────────────────────── */
        <Accordion type="single" collapsible className="w-full">
          {[...(config?.sections ?? [])]
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <SOPSectionCard key={section.id} section={section} />
            ))}
        </Accordion>
      ) : (
        /* ── EMPTY STATE ────────────────────────────────────────────────── */
        <SOPEmptyState canEdit={canEdit} onCreateFirst={handleCreateFirst} />
      )}

      {/* Footer */}
      <div className="text-center pt-6 border-t border-dashed">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          HalaqahId Information System
        </p>
      </div>
    </div>
  );
}
