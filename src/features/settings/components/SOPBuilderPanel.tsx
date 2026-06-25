import { Plus, Save, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SOPConfig, SOPSection, SOPItem, SOPItemType } from "@/types/domain/sekolah";
import { SOPSectionEditor } from "./SOPSectionEditor";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface SOPBuilderPanelProps {
  config: SOPConfig;
  saveStatus: SaveStatus;
  onSave: () => void;
  // Section ops
  onAddSection: () => void;
  onUpdateSection: (id: string, updates: Partial<Pick<SOPSection, "title">>) => void;
  onDeleteSection: (id: string) => void;
  onMoveSectionUp: (id: string) => void;
  onMoveSectionDown: (id: string) => void;
  // Item ops
  onAddItem: (sectionId: string) => void;
  onUpdateItem: (sectionId: string, itemId: string, updates: Partial<Pick<SOPItem, "subtitle" | "type" | "content">>) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  onAddContentLine: (sectionId: string, itemId: string) => void;
  onUpdateContentLine: (sectionId: string, itemId: string, lineIdx: number, value: string) => void;
  onRemoveContentLine: (sectionId: string, itemId: string, lineIdx: number) => void;
  onChangeItemType: (sectionId: string, itemId: string, type: SOPItemType) => void;
}

const SAVE_STATUS_UI: Record<
  SaveStatus,
  { icon: React.ReactNode; label: string; disabled: boolean; className: string }
> = {
  idle: {
    icon: <Save className="w-4 h-4" />,
    label: "Simpan SOP",
    disabled: false,
    className: "",
  },
  saving: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    label: "Menyimpan...",
    disabled: true,
    className: "opacity-70",
  },
  saved: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: "Tersimpan!",
    disabled: true,
    className: "bg-green-600 hover:bg-green-600 border-green-600",
  },
  error: {
    icon: <AlertCircle className="w-4 h-4" />,
    label: "Gagal simpan — coba lagi",
    disabled: false,
    className: "bg-destructive hover:bg-destructive/90 border-destructive",
  },
};

export function SOPBuilderPanel({
  config,
  saveStatus,
  onSave,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddContentLine,
  onUpdateContentLine,
  onRemoveContentLine,
  onChangeItemType,
}: SOPBuilderPanelProps) {
  const ui = SAVE_STATUS_UI[saveStatus];
  const sections = config.sections;

  return (
    <div className="space-y-4">
      {/* Builder header */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            Mode Edit SOP
          </p>
        </div>
        <Button
          size="sm"
          className={`h-8 gap-1.5 text-xs ${ui.className}`}
          onClick={onSave}
          disabled={ui.disabled}
        >
          {ui.icon}
          {ui.label}
        </Button>
      </div>

      {/* Sections list */}
      {sections.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground italic">
            Belum ada section. Tambahkan section pertama!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, idx) => (
            <SOPSectionEditor
              key={section.id}
              section={section}
              isFirst={idx === 0}
              isLast={idx === sections.length - 1}
              onMoveUp={() => onMoveSectionUp(section.id)}
              onMoveDown={() => onMoveSectionDown(section.id)}
              onDelete={() => onDeleteSection(section.id)}
              onTitleChange={(title) => onUpdateSection(section.id, { title })}
              onAddItem={() => onAddItem(section.id)}
              onUpdateItem={(itemId, updates) => onUpdateItem(section.id, itemId, updates)}
              onDeleteItem={(itemId) => onDeleteItem(section.id, itemId)}
              onAddContentLine={(itemId) => onAddContentLine(section.id, itemId)}
              onUpdateContentLine={(itemId, lineIdx, value) =>
                onUpdateContentLine(section.id, itemId, lineIdx, value)
              }
              onRemoveContentLine={(itemId, lineIdx) =>
                onRemoveContentLine(section.id, itemId, lineIdx)
              }
              onChangeItemType={(itemId, type) => onChangeItemType(section.id, itemId, type)}
            />
          ))}
        </div>
      )}

      {/* Add section */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
        onClick={onAddSection}
      >
        <Plus className="w-4 h-4" />
        Tambah Section Baru
      </Button>

      {/* Bottom save */}
      {sections.length > 1 && (
        <div className="pt-2">
          <Button
            size="sm"
            className={`w-full gap-2 ${ui.className}`}
            onClick={onSave}
            disabled={ui.disabled}
          >
            {ui.icon}
            {ui.label}
          </Button>
        </div>
      )}
    </div>
  );
}
