import { SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SettingsEmptyStateProps {
  onReset: () => void;
}

export function SettingsEmptyState({ onReset }: SettingsEmptyStateProps) {
  return (
    <Card className="text-center">
      <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-lg">Pengaturan Tidak Ditemukan</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
          Tidak ada modul atau konfigurasi yang cocok dengan kata kunci yang Anda masukkan. Coba gunakan istilah umum lainnya.
        </p>
        <Button variant="default" size="sm" onClick={onReset}>
          Reset Pencarian
        </Button>
      </CardContent>
    </Card>
  );
}
