import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SOPEmptyStateProps {
  canEdit: boolean;
  onCreateFirst: () => void;
}

export function SOPEmptyState({ canEdit, onCreateFirst }: SOPEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-5">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <FileText className="w-9 h-9 text-primary/60" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-muted border-2 border-background flex items-center justify-center">
          <span className="text-[9px] text-muted-foreground font-bold">!</span>
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="font-bold text-base text-foreground">
          {canEdit ? "Belum ada SOP yang dibuat" : "SOP belum tersedia"}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {canEdit
            ? "Buat Standar Operasional Prosedur (SOP) khusus untuk sekolah ini. Kamu bisa menambahkan section, sub-item, dan isi sesuai kebutuhan."
            : "Admin sekolah belum membuat SOP untuk lembaga ini. Hubungi admin untuk informasi lebih lanjut."}
        </p>
      </div>

      {canEdit && (
        <Button
          onClick={onCreateFirst}
          className="gap-2 mt-2"
          size="sm"
        >
          <PlusCircle className="w-4 h-4" />
          Buat SOP Pertama
        </Button>
      )}
    </div>
  );
}
