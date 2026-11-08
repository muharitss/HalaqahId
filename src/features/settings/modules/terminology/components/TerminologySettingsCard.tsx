import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Info, Undo2 } from "lucide-react";
import { useTerminologySettings } from "../hooks/useTerminologySettings";
import { TerminologyItemCard } from "./TerminologyItemCard";
import type { TerminologyConfigItem } from "../types";

interface TerminologySettingsCardProps {
  entityConfigs?: TerminologyConfigItem[];
  customLabels?: Record<string, string>;
  savingKey?: string | null;
  isSavingAll?: boolean;
  handleLabelChange?: (code: string, val: string) => void;
  handleSaveItem?: (code: string) => void;
  handleResetItem?: (code: string) => void;
  handleSaveAll?: (e?: React.FormEvent) => void;
  onResetAll?: () => void;
}

export function TerminologySettingsCard(props: TerminologySettingsCardProps) {
  const hookData = useTerminologySettings();

  const entityConfigs = props.entityConfigs ?? hookData.entityConfigs;
  const customLabels = props.customLabels ?? hookData.customLabels;
  const savingKey =
    props.savingKey !== undefined ? props.savingKey : hookData.savingKey;
  const isSavingAll =
    props.isSavingAll !== undefined ? props.isSavingAll : hookData.isSavingAll;
  const handleLabelChange =
    props.handleLabelChange ?? hookData.handleLabelChange;
  const handleResetItem = props.handleResetItem ?? hookData.handleResetItem;
  const handleSaveAll = props.handleSaveAll ?? hookData.handleSaveAll;

  // Revert all to default labels
  const handleRevert = () => {
    if (props.onResetAll) {
      props.onResetAll();
    } else {
      entityConfigs.forEach((item) => {
        handleLabelChange(item.code, item.defaultLabel);
      });
    }
  };

  return (
    <form onSubmit={handleSaveAll}>
      <Card className="overflow-hidden shadow-xs border">
        {/* ── 2-COLUMN GRID (Ke samping 2, ke bawah banyak) ── */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {entityConfigs.map((item) => {
            const currentVal = customLabels[item.code] ?? "";

            return (
              <TerminologyItemCard
                key={item.code}
                config={item}
                value={currentVal}
                disabled={isSavingAll}
                onChange={(val) => handleLabelChange(item.code, val)}
                onReset={() => handleResetItem(item.code)}
              />
            );
          })}
        </div>

        {/* ── SINGLE ACTION FOOTER AT THE BOTTOM ── */}
        <div className="p-3.5 bg-muted/30 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs w-full sm:w-auto">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              {entityConfigs.length} istilah siap disinkronisasi ke sistem.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSavingAll}
              onClick={handleRevert}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Batal Perubahan</span>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSavingAll || Boolean(savingKey)}
              className="h-8 px-4 text-xs font-semibold gap-1.5 shadow-2xs"
            >
              {isSavingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              <span>
                {isSavingAll ? "Menyimpan..." : "Simpan Semua Istilah"}
              </span>
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
