import { Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CustomField } from "../types/form-setoran.types";

interface FormPreviewCardProps {
  fields: CustomField[];
}

export function FormPreviewCard({ fields }: FormPreviewCardProps) {
  return (
    <Card className="border-primary/10 shadow-sm bg-muted/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Eye size={18} className="text-primary" />
          Preview Form Setoran
        </CardTitle>
        <CardDescription>Visualisasi form input yang akan tampil di muhafiz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core fields preview */}
        <div className="space-y-2 opacity-50 pointer-events-none">
          <div className="space-y-1">
            <Label className="text-xs">Pilih Santri *</Label>
            <Input placeholder="Nama Santri" size={32} readOnly className="h-9 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Kategori Setoran *</Label>
            <Input placeholder="Ziyadah" size={32} readOnly className="h-9 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Juz / Surat / Ayat *</Label>
            <Input placeholder="Juz 30, An-Naba: 1-10" size={32} readOnly className="h-9 text-xs" />
          </div>
        </div>

        <Separator className="my-2" />

        {/* Dynamic fields preview */}
        <div>
          <h4 className="text-xs font-semibold text-primary mb-3">Field Kustom Anda:</h4>
          {fields.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-4 bg-card rounded-md border border-dashed">
              Tidak ada field kustom. Hanya field utama yang akan ditampilkan.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <Label className="text-xs font-medium">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>

                  {field.type === "text" && (
                    <Input placeholder="Masukkan teks..." readOnly className="h-9 text-xs" />
                  )}

                  {field.type === "number" && (
                    <Input type="number" placeholder="0" readOnly className="h-9 text-xs" />
                  )}

                  {field.type === "select" && (
                    <Select disabled>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Pilih salah satu..." />
                      </SelectTrigger>
                    </Select>
                  )}

                  {field.type === "boolean" && (
                    <div className="flex items-center space-x-2 pt-1">
                      <Checkbox id={`preview-${field.id}`} disabled />
                      <label className="text-xs font-normal text-muted-foreground pointer-events-none">
                        Ya / Tidak
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

