import { ChevronUp, ChevronDown, Trash2, Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SOPSection, SOPItem, SOPItemType } from "@/types/domain/sekolah";

interface SOPSectionEditorProps {
  section: SOPSection;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onTitleChange: (title: string) => void;
  // Item ops
  onAddItem: () => void;
  onUpdateItem: (itemId: string, updates: Partial<Pick<SOPItem, "subtitle" | "type" | "content">>) => void;
  onDeleteItem: (itemId: string) => void;
  onAddContentLine: (itemId: string) => void;
  onUpdateContentLine: (itemId: string, lineIdx: number, value: string) => void;
  onRemoveContentLine: (itemId: string, lineIdx: number) => void;
  onChangeItemType: (itemId: string, type: SOPItemType) => void;
}

const ITEM_TYPE_LABELS: Record<SOPItemType, string> = {
  bullet_list: "Daftar Poin (•)",
  numbered_list: "Daftar Bernomor (1.)",
  text: "Paragraf Teks",
};

export function SOPSectionEditor({
  section,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
  onTitleChange,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddContentLine,
  onUpdateContentLine,
  onRemoveContentLine,
  onChangeItemType,
}: SOPSectionEditorProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          value={section.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Judul section (contoh: Supervisor, Alur Kerja...)"
          className="flex-1 font-semibold text-sm h-8 border-transparent bg-transparent focus-visible:bg-background focus-visible:border-border px-2"
        />
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Pindah ke atas"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onMoveDown}
            disabled={isLast}
            title="Pindah ke bawah"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
            title="Hapus section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-4">
        {section.items.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-3">
            Belum ada konten. Tambahkan sub-item di bawah.
          </p>
        )}

        {section.items.map((item) => (
          <div
            key={item.id}
            className="border border-border/60 rounded-lg p-3 space-y-3 bg-muted/20"
          >
            {/* Item header row */}
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Sub-judul (opsional)
                  </Label>
                  <Input
                    value={item.subtitle ?? ""}
                    onChange={(e) =>
                      onUpdateItem(item.id, { subtitle: e.target.value })
                    }
                    placeholder="Contoh: Job Desk 1: Pemantauan..."
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Tipe konten
                  </Label>
                  <Select
                    value={item.type}
                    onValueChange={(val) =>
                      onChangeItemType(item.id, val as SOPItemType)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ITEM_TYPE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val} className="text-sm">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 mt-0.5"
                onClick={() => onDeleteItem(item.id)}
                title="Hapus sub-item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Content lines */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground block">
                {item.type === "text" ? "Isi paragraf" : "Daftar poin"}
              </Label>
              {item.content.map((line, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-xs text-muted-foreground mt-2 w-4 shrink-0 text-right">
                    {item.type === "numbered_list" ? `${idx + 1}.` : "•"}
                  </span>
                  {item.type === "text" ? (
                    <Textarea
                      value={line}
                      onChange={(e) =>
                        onUpdateContentLine(item.id, idx, e.target.value)
                      }
                      placeholder="Isi teks paragraf..."
                      className="text-sm resize-none min-h-[64px]"
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={line}
                      onChange={(e) =>
                        onUpdateContentLine(item.id, idx, e.target.value)
                      }
                      placeholder={`Poin ${idx + 1}...`}
                      className="h-8 text-sm flex-1"
                    />
                  )}
                  {item.content.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveContentLine(item.id, idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              {item.type !== "text" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 pl-5"
                  onClick={() => onAddContentLine(item.id)}
                >
                  <Plus className="w-3 h-3" />
                  Tambah poin
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add item button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs border-dashed"
          onClick={onAddItem}
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Sub-Item
        </Button>
      </div>
    </div>
  );
}
