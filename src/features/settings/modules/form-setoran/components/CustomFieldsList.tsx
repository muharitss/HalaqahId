import { Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CustomField } from "../types/form-setoran.types";

interface CustomFieldsListProps {
  fields: CustomField[];
  handleRemoveField: (id: string) => void;
}

export function CustomFieldsList({ fields, handleRemoveField }: CustomFieldsListProps) {
  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <Settings size={40} className="stroke-[1.2] mb-3 text-muted-foreground/60" />
        <p className="text-sm font-medium">Belum ada field tambahan</p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          Default-nya form setoran hanya menampilkan kolom inti. Tambahkan field baru jika
          sekolah Anda membutuhkan evaluasi tambahan (seperti evaluasi lancar/ulang, jumlah salah).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field, idx) => (
        <div
          key={field.id}
          className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm hover:border-primary/20 transition-all duration-200"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground w-5">
                #{idx + 1}
              </span>
              <h4 className="font-semibold text-sm">{field.label}</h4>
              <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono">
                {field.id}
              </span>
              {field.required && (
                <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded font-medium">
                  Wajib
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground pl-7">
              Tipe:{" "}
              <span className="capitalize font-medium text-foreground">
                {field.type === "select" ? "Pilihan (Dropdown)" : field.type}
              </span>
              {field.options && (
                <span>
                  {" "}
                  ({field.options.join(", ")})
                </span>
              )}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveField(field.id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-full"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      ))}
    </div>
  );
}

