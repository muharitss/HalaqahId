import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  /** Current image URL value */
  value: string;
  /** Called with the new URL after a successful upload or when cleared */
  onChange: (url: string) => void;
  /** Label displayed above the upload area */
  label: string;
  /** Optional description text below the area */
  description?: string;
  /** Cloudinary folder to place the uploaded image in */
  folder?: string;
  /** Accepted file types */
  accept?: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export const ImageUploadField = ({
  value,
  onChange,
  label,
  description,
  folder,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [preview, setPreview] = useState<string>(value);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    // Quick size guard (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file terlalu besar (maksimal 5 MB)");
      setStatus("error");
      return;
    }

    // Local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setStatus("uploading");
    setErrorMsg("");

    try {
      const result = await uploadToCloudinary(file, folder);
      setPreview(result.secure_url);
      onChange(result.secure_url);
      setStatus("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload gagal";
      setErrorMsg(msg);
      setStatus("error");
      setPreview(value); // revert preview
    } finally {
      URL.revokeObjectURL(localUrl);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be selected again
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview("");
    onChange("");
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium leading-none">{label}</p>

      {/* Drop Zone / Preview Area */}
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
          status === "error" && "border-destructive/50 bg-destructive/5"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          /* Image Preview */
          <div className="relative group flex items-center justify-center p-4 min-h-[120px] w-full bg-white rounded-xl shadow-inner border border-muted/10">
            <img
              src={preview}
              alt="Preview logo"
              className="max-h-28 max-w-full object-contain"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                disabled={status === "uploading"}
                className="gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Ganti
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleClear}
                disabled={status === "uploading"}
                className="gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Hapus
              </Button>
            </div>
            {/* Status badge */}
            {status === "uploading" && (
              <div className="absolute top-2 right-2 bg-background/90 rounded-full px-2 py-1 flex items-center gap-1.5 text-xs font-medium shadow-md">
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                Mengupload...
              </div>
            )}
            {status === "success" && (
              <div className="absolute top-2 right-2 bg-green-500/90 text-white rounded-full px-2 py-1 flex items-center gap-1.5 text-xs font-medium shadow-md">
                <CheckCircle2 className="w-3 h-3" />
                Tersimpan
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <button
            type="button"
            className="w-full flex flex-col items-center justify-center gap-3 py-8 px-4 cursor-pointer"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
          >
            {status === "uploading" ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {status === "uploading" ? "Mengupload ke Cloudinary..." : "Klik atau seret gambar ke sini"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WebP, SVG · Maks. 5 MB
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Error message */}
      {status === "error" && errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Description */}
      {description && status !== "error" && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};
