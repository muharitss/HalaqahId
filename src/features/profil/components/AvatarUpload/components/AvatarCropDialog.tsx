import { Sparkles, ZoomIn, ZoomOut, RotateCw, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImageCrop } from "../hooks/use-image-crop";

interface AvatarCropDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  isUploading: boolean;
  onApplyCrop: (
    img: HTMLImageElement | null,
    zoom: number,
    rotation: number,
    offset: { x: number; y: number }
  ) => void;
}

export function AvatarCropDialog({
  isOpen,
  onOpenChange,
  imageSrc,
  isUploading,
  onApplyCrop,
}: AvatarCropDialogProps) {
  const {
    canvasRef,
    imageElementRef,
    zoom,
    setZoom,
    rotation,
    rotate90,
    offset,
    resetCrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useImageCrop({ isOpen, imageSrc, canvasSize: 300 });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-110 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-4 w-4 text-primary" />
            Sesuaikan Foto Profil
          </DialogTitle>
          <DialogDescription className="text-xs">
            Geser dan perbesar foto untuk mendapatkan potongan lingkaran terbaik.
          </DialogDescription>
        </DialogHeader>

        {/* Viewport Canvas Crop */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative w-75 h-75 rounded-2xl overflow-hidden bg-muted/80 border shadow-inner flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-75 h-75"
            />
            {/* Circular Mask */}
            <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] m-4" />
          </div>

          {/* Controls: Zoom Slider & Rotate */}
          <div className="w-full space-y-3 mt-4 bg-muted/30 p-3.5 rounded-xl border">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <ZoomOut className="h-3.5 w-3.5" />
                Zoom
              </span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <ZoomIn className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={rotate90}
                className="h-7 text-xs gap-1 px-2.5 rounded-lg"
              >
                <RotateCw className="h-3 w-3" />
                Putar 90°
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetCrop}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                Reset Posisi
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
            className="gap-1 text-xs h-9"
          >
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
          <Button
            type="button"
            onClick={() =>
              onApplyCrop(imageElementRef.current, zoom, rotation, offset)
            }
            disabled={isUploading}
            className="gap-1.5 text-xs h-9 px-5 font-semibold"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Mengunggah...
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                Terapkan & Simpan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
