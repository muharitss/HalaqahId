import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Phone,
  Mail,
  Users,
  Loader2,
} from "lucide-react";
import { useSantriWali } from "../hooks/useSantriWali";
import {
  HubunganWali,
  HUBUNGAN_WALI_LABELS,
  type SantriWali,
} from "@/types/domain/santri-wali";
import type { SantriWaliFormData } from "../validation/santri-wali.schema";

export interface SantriWaliSectionProps {
  santriId: number;
  santriName?: string;
  readOnly?: boolean;
}

export function SantriWaliSection({
  santriId,
  santriName,
  readOnly = false,
}: SantriWaliSectionProps) {
  const {
    waliList,
    isLoading,
    isSubmitting,
    isFormOpen,
    editingWali,
    formErrors,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleSave,
    isDeleteOpen,
    deletingWali,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    handleSetPrimary,
  } = useSantriWali(santriId);

  // Local form state
  const [formData, setFormData] = useState<SantriWaliFormData>({
    nama_wali: "",
    hubungan: HubunganWali.AYAH,
    no_telepon: "",
    email: "",
    is_primary_contact: false,
  });

  useEffect(() => {
    if (editingWali) {
      setFormData({
        nama_wali: editingWali.nama_wali,
        hubungan: editingWali.hubungan,
        no_telepon: editingWali.no_telepon || "",
        email: editingWali.email || "",
        is_primary_contact: editingWali.is_primary_contact,
      });
    } else {
      setFormData({
        nama_wali: "",
        hubungan: HubunganWali.AYAH,
        no_telepon: "",
        email: "",
        is_primary_contact: waliList.length === 0, // default true if first wali
      });
    }
  }, [editingWali, isFormOpen, waliList.length]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave(formData);
  };

  const formatWhatsAppUrl = (phone: string | null | undefined) => {
    if (!phone) return null;
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Daftar Wali {santriName ? `(${santriName})` : ""}
          </h3>
          <p className="text-xs text-muted-foreground">
            Kelola data orang tua atau wali santri dan kontak utama
          </p>
        </div>
        {!readOnly && (
          <Button
            size="sm"
            onClick={openCreateDialog}
            className="h-8 gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Wali</span>
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-xs">Memuat data wali...</span>
        </div>
      ) : waliList.length === 0 ? (
        <div className="text-center py-8 px-4 border border-dashed rounded-lg bg-muted/20">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-foreground">Belum ada data wali</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Klik tombol "Tambah Wali" untuk menambahkan data orang tua / wali santri.
          </p>
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={openCreateDialog}
              className="mt-3 h-8 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Wali Pertama</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold text-xs">Nama Wali</TableHead>
                <TableHead className="font-semibold text-xs">Hubungan</TableHead>
                <TableHead className="font-semibold text-xs">Kontak</TableHead>
                <TableHead className="font-semibold text-xs">Status</TableHead>
                {!readOnly && (
                  <TableHead className="text-right font-semibold text-xs">Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {waliList.map((wali: SantriWali) => {
                const waUrl = formatWhatsAppUrl(wali.no_telepon);
                return (
                  <TableRow key={wali.id_wali} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-sm py-3">
                      <div>
                        <span>{wali.nama_wali}</span>
                        {wali.email && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Mail className="h-3 w-3" />
                            <span>{wali.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="font-normal text-xs">
                        {HUBUNGAN_WALI_LABELS[wali.hubungan as keyof typeof HUBUNGAN_WALI_LABELS] || wali.hubungan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {wali.no_telepon ? (
                        waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary hover:underline"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{wali.no_telepon}</span>
                          </a>
                        ) : (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{wali.no_telepon}</span>
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {wali.is_primary_contact ? (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20 gap-1 text-[11px] font-medium"
                        >
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span>Kontak Utama</span>
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    {!readOnly && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!wali.is_primary_contact && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-muted-foreground hover:text-primary px-2"
                              onClick={() => handleSetPrimary(wali)}
                              title="Jadikan kontak utama"
                            >
                              <Star className="h-3.5 w-3.5 mr-1" />
                              <span className="hidden sm:inline">Set Utama</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => openEditDialog(wali)}
                            title="Edit data wali"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => openDeleteDialog(wali)}
                            title="Hapus wali"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={closeFormDialog}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={onFormSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingWali ? "Edit Data Wali Santri" : "Tambah Wali Santri"}
              </DialogTitle>
              <DialogDescription>
                Lengkapi informasi wali atau orang tua santri berikut.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3.5 py-4">
              {/* Nama Wali */}
              <div className="space-y-1">
                <Label htmlFor="nama_wali">
                  Nama Wali <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nama_wali"
                  value={formData.nama_wali}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nama_wali: e.target.value }))
                  }
                  placeholder="Contoh: Drs. Hendra Gunawan"
                  required
                />
                {formErrors.nama_wali && (
                  <p className="text-xs text-destructive">{formErrors.nama_wali}</p>
                )}
              </div>

              {/* Hubungan */}
              <div className="space-y-1">
                <Label htmlFor="hubungan">
                  Hubungan <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.hubungan}
                  onValueChange={(val: HubunganWali) =>
                    setFormData((prev) => ({ ...prev, hubungan: val }))
                  }
                >
                  <SelectTrigger id="hubungan">
                    <SelectValue placeholder="Pilih hubungan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(HubunganWali).map((rel) => (
                      <SelectItem key={rel} value={rel}>
                        {HUBUNGAN_WALI_LABELS[rel] || rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.hubungan && (
                  <p className="text-xs text-destructive">{formErrors.hubungan}</p>
                )}
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-1">
                <Label htmlFor="no_telepon">Nomor WhatsApp / Telepon</Label>
                <Input
                  id="no_telepon"
                  type="tel"
                  value={formData.no_telepon || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, no_telepon: e.target.value }))
                  }
                  placeholder="Contoh: 081234567890"
                />
                {formErrors.no_telepon && (
                  <p className="text-xs text-destructive">{formErrors.no_telepon}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Contoh: orangtua@example.com"
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive">{formErrors.email}</p>
                )}
              </div>

              {/* Checkbox Kontak Utama */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="is_primary_contact"
                  checked={formData.is_primary_contact}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_primary_contact: checked === true,
                    }))
                  }
                />
                <Label
                  htmlFor="is_primary_contact"
                  className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Jadikan sebagai kontak utama santri ini
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={closeFormDialog}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : editingWali ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Wali"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Wali Santri?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data wali{" "}
              <strong className="text-foreground">{deletingWali?.nama_wali}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isSubmitting ? "Menghapus..." : "Hapus Wali"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SantriWaliSection;
