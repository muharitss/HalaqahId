import React, { useEffect } from "react";
import { usePDF } from "@react-pdf/renderer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2, FileText, MonitorOff } from "lucide-react";
import { toast } from "sonner";

interface PdfPreviewInnerProps {
  document: React.ReactElement;
  filename: string;
  onClose: () => void;
}

function PdfPreviewInner({ document: docElement, filename, onClose }: PdfPreviewInnerProps) {
  const [instance, updateInstance] = usePDF({ document: docElement });

  // Update instance if document changes
  useEffect(() => {
    updateInstance(docElement);
  }, [docElement, updateInstance]);

  const handleDownload = () => {
    if (!instance.blob) {
      toast.error("PDF belum siap diunduh");
      return;
    }
    const url = URL.createObjectURL(instance.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Laporan PDF berhasil diunduh!");
  };

  const handleOpenInNewTab = () => {
    if (!instance.url) {
      toast.error("PDF belum siap dibuka");
      return;
    }
    window.open(instance.url, "_blank");
  };

  const isMobile =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  if (instance.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Menyiapkan pratinjau PDF...
        </p>
      </div>
    );
  }

  if (instance.error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-destructive">
        <MonitorOff className="h-10 w-10 text-destructive/80" />
        <p className="text-sm font-semibold">Gagal memuat pratinjau PDF</p>
        <p className="text-xs text-muted-foreground max-w-md text-center px-4">
          Terjadi kesalahan saat memproses data PDF. Pastikan data laporan valid.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* PDF View Container */}
      <div className="flex-1 min-h-[350px] sm:min-h-[450px] border rounded-lg overflow-hidden bg-muted relative">
        {isMobile ? (
          <div className="flex flex-col items-center justify-center absolute inset-0 p-6 text-center space-y-3 bg-card">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <FileText className="h-10 w-10" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Pratinjau Tidak Tersedia</h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Pratinjau interaktif langsung tidak didukung pada browser perangkat mobile. Silakan buka di tab baru atau langsung unduh berkas di bawah.
            </p>
          </div>
        ) : (
          instance.url && (
            <iframe
              src={`${instance.url}#toolbar=0&navpanes=0`}
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          )
        )}
      </div>

      <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-end">
          <Button
            variant="outline"
            onClick={handleOpenInNewTab}
            disabled={!instance.url}
            className="w-full sm:w-auto"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Buka di Tab Baru
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!instance.blob}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Unduh PDF
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto border"
          >
            Tutup
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}

interface PdfPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: React.ReactElement | null;
  filename: string;
  title?: string;
}

export function PdfPreviewDialog({
  isOpen,
  onOpenChange,
  document: docElement,
  filename,
  title = "Pratinjau Dokumen PDF",
}: PdfPreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] sm:h-[85vh] flex flex-col p-6 gap-4">
        <DialogHeader className="pb-1 border-b">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Silakan tinjau tampilan dokumen sebelum mengunduh berkas laporan Anda.
          </DialogDescription>
        </DialogHeader>

        {isOpen && docElement ? (
          <div className="flex-1 min-h-0">
            <PdfPreviewInner
              document={docElement}
              filename={filename}
              onClose={() => onOpenChange(false)}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
