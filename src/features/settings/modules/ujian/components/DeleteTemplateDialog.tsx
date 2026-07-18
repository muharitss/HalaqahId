import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ExamTemplate } from "@/features/setoran/api/ujian-api";

interface DeleteTemplateDialogProps {
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedTemplate: ExamTemplate | null;
  handleDeleteTemplate: () => void;
  isDeletingTemplate: boolean;
}

export function DeleteTemplateDialog({
  isDeleteOpen,
  setIsDeleteOpen,
  selectedTemplate,
  handleDeleteTemplate,
  isDeletingTemplate,
}: DeleteTemplateDialogProps) {
  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus templat ujian{" "}
            <strong>{selectedTemplate?.nama_template || selectedTemplate?.nama_ujian}</strong>? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
            className="h-9.5 font-semibold text-xs"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteTemplate}
            disabled={isDeletingTemplate}
            className="h-9.5 font-semibold text-xs"
          >
            {isDeletingTemplate ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
