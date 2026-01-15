import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SantriModal({ isOpen, onClose, onSave, selectedSantri, isAdmin, halaqahList, isSubmitting }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSave}>
          <DialogHeader>
            <DialogTitle>{selectedSantri ? "Edit Santri" : "Tambah Santri Baru"}</DialogTitle>
            <DialogDescription>Isi data santri di bawah ini.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama_santri">Nama Santri *</Label>
              <Input id="nama_santri" name="nama_santri" defaultValue={selectedSantri?.nama_santri || ""} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nomor_telepon">Nomor Telepon *</Label>
              <Input id="nomor_telepon" name="nomor_telepon" defaultValue={selectedSantri?.nomor_telepon || ""} required type="tel" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target">Target Hafalan *</Label>
              <Select name="target" defaultValue={selectedSantri?.target || "SEDANG"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RINGAN">Ringan (1 halaman / 2 pekan)</SelectItem>
                  <SelectItem value="SEDANG">Sedang (2 halaman / 2 pekan)</SelectItem>
                  <SelectItem value="INTENSE">Intense (4 halaman / 2 pekan)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isAdmin && (
              <div className="grid gap-2">
                <Label htmlFor="halaqah_id">Halaqah *</Label>
                <Select name="halaqah_id" defaultValue={selectedSantri?.halaqah_id?.toString() || ""}>
                  <SelectTrigger><SelectValue placeholder="Pilih halaqah" /></SelectTrigger>
                  <SelectContent>
                    {halaqahList.map((h: any) => (
                      <SelectItem key={h.id_halaqah} value={h.id_halaqah.toString()}>{h.nama_halaqah}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}