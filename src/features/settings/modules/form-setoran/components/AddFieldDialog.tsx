import { HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddFieldDialogProps {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  newFieldLabel: string;
  setNewFieldLabel: (val: string) => void;
  newFieldId: string;
  setNewFieldId: (val: string) => void;
  newFieldType: "text" | "number" | "select" | "boolean";
  setNewFieldType: (val: "text" | "number" | "select" | "boolean") => void;
  newFieldOptionsString: string;
  setNewFieldOptionsString: (val: string) => void;
  newFieldRequired: boolean;
  setNewFieldRequired: (val: boolean) => void;
  handleAddField: () => void;
}

export function AddFieldDialog({
  isAddOpen,
  setIsAddOpen,
  newFieldLabel,
  setNewFieldLabel,
  newFieldId,
  setNewFieldId,
  newFieldType,
  setNewFieldType,
  newFieldOptionsString,
  setNewFieldOptionsString,
  newFieldRequired,
  setNewFieldRequired,
  handleAddField,
}: AddFieldDialogProps) {
  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus size={14} />
          Tambah Field
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Field Kustom Baru</DialogTitle>
          <DialogDescription>
            Tambahkan kolom input kustom baru ke dalam formulir setoran.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="field-label">Label Field (Bahasa Indonesia)</Label>
            <Input
              id="field-label"
              placeholder="Contoh: Status Lancar, Jumlah Salah"
              value={newFieldLabel}
              onChange={(e) => {
                setNewFieldLabel(e.target.value);
                // Auto generate ID if not manually changed
                if (!newFieldId) {
                  setNewFieldId(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
                  );
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-id">
              ID / Key Field (Unik, huruf kecil & underscore saja)
            </Label>
            <Input
              id="field-id"
              placeholder="Contoh: status_lancar, jumlah_salah"
              value={newFieldId}
              onChange={(e) => setNewFieldId(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <HelpCircle size={10} />
              Digunakan sebagai kunci penyimpanan di database.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Tipe Input / Kontrol Form</Label>
            <Select
              value={newFieldType}
              onValueChange={(val: any) => setNewFieldType(val)}
            >
              <SelectTrigger id="field-type">
                <SelectValue placeholder="Pilih tipe..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Teks Bebas (Satu Baris)</SelectItem>
                <SelectItem value="number">
                  Angka / Numerik (seperti Taqwim)
                </SelectItem>
                <SelectItem value="select">
                  Pilihan Ganda (Dropdown Select)
                </SelectItem>
                <SelectItem value="boolean">
                  Konfirmasi Checkbox (Ya/Tidak)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newFieldType === "select" && (
            <div className="space-y-2 animate-in slide-in-from-top duration-300">
              <Label htmlFor="field-options">
                Pilihan Opsi (Pisahkan dengan koma)
              </Label>
              <Input
                id="field-options"
                placeholder="Contoh: Lanjut, Ulang, Lancar Sekali"
                value={newFieldOptionsString}
                onChange={(e) => setNewFieldOptionsString(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Masukkan opsi yang ingin ditampilkan pada pilihan dropdown.
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="field-required"
              checked={newFieldRequired}
              onCheckedChange={(checked: boolean) =>
                setNewFieldRequired(checked)
              }
            />
            <Label
              htmlFor="field-required"
              className="text-xs font-normal cursor-pointer select-none"
            >
              Wajib diisi oleh Muhafiz (Required field)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleAddField}>Tambahkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
