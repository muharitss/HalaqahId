import { AlertCircle } from "lucide-react";

interface FormFooterProps {
  isValid: boolean;
  sesiName?: string;
}

export function FormFooter({ isValid, sesiName }: FormFooterProps) {
  if (isValid) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg flex items-start gap-3">
      <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold text-sm">
          Sesi {sesiName} tidak dijadwalkan hari ini.
        </p>
        <p className="text-xs mt-1">
          Setoran hanya dapat dicatat sesuai dengan jadwal hari sesi. Silakan
          pilih sesi lain.
        </p>
      </div>
    </div>
  );
}