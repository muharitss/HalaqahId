import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  StatusIzin,
  JenisIzin,
  STATUS_IZIN_LABELS,
  JENIS_IZIN_LABELS,
} from "../types";

interface IzinStatusBadgeProps {
  status: StatusIzin;
  className?: string;
}

export function IzinStatusBadge({ status, className = "" }: IzinStatusBadgeProps) {
  switch (status) {
    case StatusIzin.PENDING:
      return (
        <Badge
          variant="outline"
          className={`bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700 dark:text-amber-400 gap-1.5 font-medium ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          {STATUS_IZIN_LABELS[status]}
        </Badge>
      );
    case StatusIzin.DISETUJUI:
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:border-emerald-700 dark:text-emerald-400 gap-1.5 font-medium ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {STATUS_IZIN_LABELS[status]}
        </Badge>
      );
    case StatusIzin.DITOLAK:
      return (
        <Badge
          variant="outline"
          className={`bg-destructive/10 text-destructive border-destructive/30 gap-1.5 font-medium ${className}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          {STATUS_IZIN_LABELS[status]}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

interface IzinJenisBadgeProps {
  jenis: JenisIzin;
  className?: string;
}

export function IzinJenisBadge({ jenis, className = "" }: IzinJenisBadgeProps) {
  let colorStyle = "bg-primary/10 text-primary border-primary/20";

  if (jenis === JenisIzin.SAKIT) {
    colorStyle = "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400";
  } else if (jenis === JenisIzin.IZIN) {
    colorStyle = "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400";
  } else if (jenis === JenisIzin.KELUARGA) {
    colorStyle = "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400";
  }

  return (
    <Badge variant="outline" className={`font-normal ${colorStyle} ${className}`}>
      {JENIS_IZIN_LABELS[jenis] || jenis}
    </Badge>
  );
}
