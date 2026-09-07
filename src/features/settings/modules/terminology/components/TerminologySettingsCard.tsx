import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTerminologySettings } from "../hooks/useTerminologySettings";
import { TerminologyItemCard } from "./TerminologyItemCard";

export function TerminologySettingsCard() {
  const {
    entityConfigs,
    customLabels,
    savingKey,
    isSavingAll,
    handleLabelChange,
    handleSaveItem,
    handleResetItem,
    handleSaveAll,
  } = useTerminologySettings();

  return (
    <Card className="shadow-sm border-primary/5">

      <CardContent>
        <form onSubmit={handleSaveAll}>
          <div className="grid gap-6 sm:grid-cols-2">
            {entityConfigs.map((item) => {
              const currentVal = customLabels[item.code] || "";
              const isSaving = savingKey === item.code;

              return (
                <TerminologyItemCard
                  key={item.code}
                  config={item}
                  value={currentVal}
                  isSaving={isSaving}
                  disabled={isSaving || isSavingAll}
                  onChange={(val) => handleLabelChange(item.code, val)}
                  onSave={() => handleSaveItem(item.code)}
                  onReset={() => handleResetItem(item.code)}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
            </div>
            <Button
              type="submit"
              disabled={isSavingAll || Boolean(savingKey)}
              className="gap-2 font-semibold"
            >
              {isSavingAll && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSavingAll ? "Menyimpan Semua..." : "Simpan Semua Istilah"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
