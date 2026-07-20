import React, { useState, useEffect } from "react";
import { Plus, Trash2, Quote, User, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axiosClient from "@/lib/axiosClient";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export function TestimonialsCard() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaultTestimonials = [
    {
      id: "1",
      name: "Ustadz Ahmad Fauzi",
      role: "Koordinator Tahfidz Ponpes Al-Hidayah",
      quote: "Sebelum menggunakan HalaqahId, kami butuh waktu 3 hari setiap akhir bulan hanya untuk merekap kartu setoran santri menjadi laporan bulanan. Sekarang, laporan tersebut siap dalam 5 detik saja!"
    },
    {
      id: "2",
      name: "Ustadzah Sarah Anindita",
      role: "Pengajar Rumah Tahfidz Quran Ar-Rahman",
      quote: "Fitur pencatatan setoran langsung dari lembaran mushaf sangat memudahkan asatidz saat menyimak hafalan santri di kelas. Rekap data jadi lebih rapi dan transparan."
    },
    {
      id: "3",
      name: "Ustadz Rizky Pratama",
      role: "Pimpinan Yayasan Quran Mulia",
      quote: "Sistem absensi dan laporan hasil belajar PDF sangat membantu kami dalam memantau perkembangan hafalan santri secara berkala. Orang tua santri juga sangat mengapresiasi kerapian datanya."
    }
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/landing/admin/sections");
      if (res.data && res.data.success) {
        const sections = res.data.data;
        const testimonialsSec = sections.find((s: any) => s.section_key === "testimonials");
        if (testimonialsSec && testimonialsSec.content) {
          const contentData = testimonialsSec.content;
          if (Array.isArray(contentData)) {
            setTestimonials(contentData);
          } else {
            // content exists but is not an array, initialize default
            await saveToBackend(defaultTestimonials);
          }
        } else {
          // testimonials section does not exist in DB yet, initialize it
          await saveToBackend(defaultTestimonials);
        }
      }
    } catch (e) {
      console.error("Gagal load testimoni dari DB:", e);
      toast.error("Gagal memuat testimoni dari database server.");
    } finally {
      setLoading(false);
    }
  };

  const saveToBackend = async (data: Testimonial[]) => {
    try {
      await axiosClient.put("/landing/admin/sections/testimonials", {
        title: "TESTIMONI PENGGUNA",
        subtitle: "Apa Kata Mereka yang Telah Menggunakan HalaqahId?",
        content: data,
        is_active: true,
        order: 5,
      });
      setTestimonials(data);
    } catch (e) {
      console.error("Gagal menyimpan testimoni ke backend:", e);
      throw e;
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !quote.trim()) {
      toast.error("Semua field harus diisi.");
      return;
    }

    setSaving(true);
    try {
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        name: name.trim(),
        role: role.trim(),
        quote: quote.trim(),
      };

      const updated = [...testimonials, newTestimonial];
      await saveToBackend(updated);
      
      // Reset form
      setName("");
      setRole("");
      setQuote("");
      toast.success("Testimoni baru berhasil disimpan ke database!");
    } catch (e) {
      toast.error("Gagal menyimpan testimoni baru.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      const updated = testimonials.filter((t) => t.id !== id);
      await saveToBackend(updated);
      toast.success("Testimoni berhasil dihapus dari database.");
    } catch (e) {
      toast.error("Gagal menghapus testimoni.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Memuat data dari database...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Form Tambah Testimoni */}
      <div className="lg:col-span-5">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-primary" />
              <span>Tambah Testimoni Baru</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Isi data testimoni untuk disimpan di database server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ustadz M. Ilyas"
                  required
                  className="text-xs"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs">Peran / Jabatan</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Contoh: Kepala Madrasah Ponpes Baitul Quran"
                  required
                  className="text-xs"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote" className="text-xs">Isi Testimoni</Label>
                <Textarea
                  id="quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Tuliskan pengalaman atau kepuasan menggunakan HalaqahId..."
                  required
                  rows={4}
                  className="text-xs"
                  disabled={saving}
                />
              </div>
              <Button type="submit" className="w-full font-bold text-xs" disabled={saving}>
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                Tambah Testimoni
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Testimoni Aktif */}
      <div className="lg:col-span-7 space-y-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Daftar Testimoni Aktif</span>
              <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {testimonials.length} Item
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Testimoni di bawah ini disimpan aman di database server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testimonials.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                <AlertCircle className="h-8 w-8 text-muted-foreground/45" />
                <p>Belum ada testimoni. Tambahkan di form sebelah kiri atau landing page akan kosong.</p>
              </div>
            ) : (
              <div className="divide-y divide-border border rounded-lg overflow-hidden bg-card">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-4 hover:bg-muted/10 transition-colors flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-bold text-xs text-foreground">{t.name}</span>
                        <span className="text-[10px] text-muted-foreground">• {t.role}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic pl-6 leading-relaxed flex items-start gap-1">
                        <Quote className="h-3 w-3 shrink-0 text-primary/40 rotate-180" />
                        "{t.quote}"
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-full shrink-0"
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
