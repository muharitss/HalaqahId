import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Trash2, Eye, HelpCircle, Save, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sekolahService } from "@/features/sekolah/api/sekolahService";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface CustomField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "boolean";
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export default function FormSetoranSettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [fields, setFields] = useState<CustomField[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states for new field
  const [newFieldId, setNewFieldId] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "select" | "boolean">("text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptionsString, setNewFieldOptionsString] = useState("");

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["schoolProfile"],
    queryFn: () => sekolahService.getProfile(),
  });

  useEffect(() => {
    if (profileData?.data?.form_setoran_config) {
      setFields(profileData.data.form_setoran_config as CustomField[]);
    } else {
      setFields([]);
    }
  }, [profileData]);

  const saveMutation = useMutation({
    mutationFn: (newConfig: CustomField[]) =>
      sekolahService.updateProfile({ form_setoran_config: newConfig }),
    onSuccess: () => {
      toast.success("Pengaturan form setoran berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: ["schoolProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profil-sekolah"] });
    },
    onError: (err: any) => {
      toast.error(`Gagal menyimpan pengaturan: ${err.message || "Terjadi kesalahan"}`);
    },
  });

  const handleAddField = () => {
    // Validasi ID
    const formattedId = newFieldId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!formattedId) {
      toast.error("ID Field tidak boleh kosong");
      return;
    }
    if (fields.some((f) => f.id === formattedId)) {
      toast.error(`ID Field "${formattedId}" sudah digunakan`);
      return;
    }
    if (!newFieldLabel.trim()) {
      toast.error("Label Field tidak boleh kosong");
      return;
    }

    const fieldToAdd: CustomField = {
      id: formattedId,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
    };

    if (newFieldType === "select") {
      const options = newFieldOptionsString
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt !== "");
      if (options.length === 0) {
        toast.error("Pilihan opsi dropdown wajib diisi (pisahkan dengan koma)");
        return;
      }
      fieldToAdd.options = options;
    }

    setFields([...fields, fieldToAdd]);
    setIsAddOpen(false);

    // Reset Form
    setNewFieldId("");
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldRequired(false);
    setNewFieldOptionsString("");

    toast.success("Field berhasil ditambahkan ke daftar sementara");
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    toast.success("Field dihapus dari daftar sementara");
  };

  const handleSaveConfig = () => {
    saveMutation.mutate(fields);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/kepala-muhafidz/settings")}
            className="rounded-full h-10 w-10 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pengaturan Form Setoran</h1>
            <p className="text-sm text-muted-foreground">
              Konfigurasi kolom input kustom tambahan untuk formulir setoran santri
            </p>
          </div>
        </div>
        <Button
          onClick={handleSaveConfig}
          disabled={saveMutation.isPending || isLoading}
          className="gap-2"
        >
          <Save size={16} />
          {saveMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL KANAN: PREVIEW FORM */}
        <div className="lg:col-span-1 space-y-6">
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
        </div>

        {/* PANEL KIRI: MANAJEMEN FIELD */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Daftar Field Kustom</CardTitle>
                <CardDescription>
                  Urutan field ini akan ditampilkan di bagian bawah form setoran muhafiz.
                </CardDescription>
              </div>
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
                            setNewFieldId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"));
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
                          <SelectItem value="number">Angka / Numerik (seperti Taqwim)</SelectItem>
                          <SelectItem value="select">Pilihan Ganda (Dropdown Select)</SelectItem>
                          <SelectItem value="boolean">Konfirmasi Checkbox (Ya/Tidak)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newFieldType === "select" && (
                      <div className="space-y-2 animate-in slide-in-from-top duration-300">
                        <Label htmlFor="field-options">Pilihan Opsi (Pisahkan dengan koma)</Label>
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
                        onCheckedChange={(checked: boolean) => setNewFieldRequired(checked)}
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
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4 py-8 text-center text-muted-foreground text-sm">
                  Memuat konfigurasi...
                </div>
              ) : fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Settings size={40} className="stroke-[1.2] mb-3 text-muted-foreground/60" />
                  <p className="text-sm font-medium">Belum ada field tambahan</p>
                  <p className="text-xs text-muted-foreground max-w-sm mt-1">
                    Default-nya form setoran hanya menampilkan kolom inti. Tambahkan field baru jika
                    sekolah Anda membutuhkan evaluasi tambahan (seperti evaluasi lancar/ulang, jumlah salah).
                  </p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
