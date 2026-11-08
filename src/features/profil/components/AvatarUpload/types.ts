export interface AvatarUploadProps {
  currentPhotoUrl?: string | null;
  name: string;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export interface DragPosition {
  x: number;
  y: number;
}
