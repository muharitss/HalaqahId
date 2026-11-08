export interface CropExportOptions {
  img: HTMLImageElement;
  zoom: number;
  rotation: number;
  offset: { x: number; y: number };
  modalSize?: number;
  outputSize?: number;
  fileName?: string;
  quality?: number;
}

/**
 * Merender hasil crop ke canvas resolusi tinggi dan mengekspornya menjadi instance File.
 */
export async function exportCroppedCanvasToFile(
  options: CropExportOptions
): Promise<File> {
  const {
    img,
    zoom,
    rotation,
    offset,
    modalSize = 300,
    outputSize = 500,
    fileName = "avatar.jpg",
    quality = 0.92,
  } = options;

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = outputSize;
  exportCanvas.height = outputSize;
  const exportCtx = exportCanvas.getContext("2d");

  if (!exportCtx) {
    throw new Error("Gagal menginisialisasi konteks render canvas");
  }

  const scaleFactor = outputSize / modalSize;

  exportCtx.save();
  exportCtx.translate(
    outputSize / 2 + offset.x * scaleFactor,
    outputSize / 2 + offset.y * scaleFactor
  );
  exportCtx.rotate((rotation * Math.PI) / 180);
  exportCtx.scale(zoom * scaleFactor, zoom * scaleFactor);

  const imgAspect = img.naturalWidth / img.naturalHeight;
  let drawWidth = modalSize;
  let drawHeight = modalSize;

  if (imgAspect > 1) {
    drawWidth = modalSize * imgAspect;
    drawHeight = modalSize;
  } else {
    drawWidth = modalSize;
    drawHeight = modalSize / imgAspect;
  }

  exportCtx.drawImage(
    img,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );
  exportCtx.restore();

  const blob = await new Promise<Blob | null>((resolve) => {
    exportCanvas.toBlob((b) => resolve(b), "image/jpeg", quality);
  });

  if (!blob) {
    throw new Error("Gagal mengompresi gambar");
  }

  const cleanName = fileName.replace(/\.[^/.]+$/, "") + "_cropped.jpg";
  return new File([blob], cleanName, { type: "image/jpeg" });
}
