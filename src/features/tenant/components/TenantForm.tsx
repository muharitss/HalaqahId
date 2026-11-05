import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Building2 } from "lucide-react";
import { useCreateTenant, useUpdateTenant } from "../hooks/useTenants";
import type { TenantListItem, TenantStatus } from "../types";

interface TenantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TenantListItem | null;
}

export function TenantForm({ open, onOpenChange, initialData }: TenantFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateTenant();
  const updateMutation = useUpdateTenant();

  const [namaTenant, setNamaTenant] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<TenantStatus>("ACTIVE");
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNamaTenant(initialData.nama_tenant);
      setSlug(initialData.slug);
      setStatus(initialData.status);
      setIsSlugTouched(true);
    } else {
      setNamaTenant("");
      setSlug("");
      setStatus("ACTIVE");
      setIsSlugTouched(false);
    }
    setValidationError(null);
  }, [initialData, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNamaTenant(val);
    if (!isEditing && !isSlugTouched) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(autoSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugTouched(true);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanName = namaTenant.trim();
    const cleanSlug = slug.trim().toLowerCase();

    if (cleanName.length < 3) {
      setValidationError("Nama tenant minimal 3 karakter");
      return;
    }

    if (cleanSlug.length < 3) {
      setValidationError("Slug minimal 3 karakter (hanya huruf kecil, angka, dan strip)");
      return;
    }

    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id_tenant,
          payload: { nama_tenant: cleanName, slug: cleanSlug },
        });
      } else {
        await createMutation.mutateAsync({
          nama_tenant: cleanName,
          slug: cleanSlug,
          status,
        });
      }
      onOpenChange(false);
    } catch {
      // Error is handled in hook toast
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <DialogTitle>{isEditing ? "Edit Tenant" : "Tambah Tenant Baru"}</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {validationError && (
            <div className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-md font-medium">
              {validationError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="nama_tenant">Nama Lembaga / Tenant</Label>
            <Input
              id="nama_tenant"
              placeholder="Contoh: Pondok Tahfidz Al-Hikmah"
              value={namaTenant}
              onChange={handleNameChange}
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug Subdomain</Label>
            <Input
              id="slug"
              placeholder="alhikmah"
              value={slug}
              onChange={handleSlugChange}
              disabled={isPending}
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Akan digunakan sebagai pengenal unik (contoh: {slug || "tenant"}.halaqah.id)
            </p>
          </div>

          {!isEditing && (
            <div className="space-y-1.5">
              <Label htmlFor="status">Status Tenant</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as TenantStatus)}
                disabled={isPending}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE (Aktif Penuh)</SelectItem>
                  <SelectItem value="TRIAL">TRIAL (Uji Coba)</SelectItem>
                  <SelectItem value="SUSPENDED">SUSPENDED (Ditangguhkan)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Simpan Perubahan" : "Buat Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
