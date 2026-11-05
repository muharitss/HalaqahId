import {
  Building2,
  User,
  School,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  Mail,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlugChecker } from "./SlugChecker";
import { useOnboardingWizard } from "../hooks/useOnboardingWizard";

interface OnboardingWizardProps {
  wizard: ReturnType<typeof useOnboardingWizard>;
}

const STEPS = [
  { number: 1, title: "Lembaga", icon: Building2 },
  { number: 2, title: "Admin", icon: User },
  { number: 3, title: "Sekolah", icon: School },
  { number: 4, title: "Paket", icon: Sparkles },
  { number: 5, title: "Konfirmasi", icon: CheckCircle },
];

export function OnboardingWizard({ wizard }: OnboardingWizardProps) {
  const {
    step,
    form,
    updateField,
    slugState,
    nextStep,
    prevStep,
    submitRegistration,
    isSubmitting,
  } = wizard;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-muted/80 backdrop-blur-xs">
      {/* Step Indicator Header */}
      <div className="p-6 border-b bg-muted/20">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = step > s.number;
            const isCurrent = step === s.number;

            return (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-1 font-medium hidden sm:inline-block ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-[2px] w-6 sm:w-12 mx-1 sm:mx-2 transition-colors ${
                      step > s.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Step Title */}
        <div className="mt-2 text-center sm:text-left">
          <Badge variant="outline" className="text-[10px] mb-1 font-semibold uppercase">
            Langkah {step} dari 5
          </Badge>
          <CardTitle className="text-xl">
            {step === 1 && "Identitas Lembaga & Subdomain"}
            {step === 2 && "Akun Administrator Utama"}
            {step === 3 && "Unit Sekolah / Cabang Pertama"}
            {step === 4 && "Pilih Paket Layanan"}
            {step === 5 && "Tinjau Data & Selesaikan Pendaftaran"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Tentukan nama institusi dan slug alamat akses web Anda"}
            {step === 2 && "Akun ini akan memiliki hak akses penuh sebagai superadmin tenant"}
            {step === 3 && "Unit pertama di mana santri dan halaqah akan dikelola"}
            {step === 4 && "Mulai secara gratis dengan masa uji coba penuh tanpa kartu kredit"}
            {step === 5 && "Periksa kebenaran informasi sebelum sistem menyiapkan aplikasi Anda"}
          </CardDescription>
        </div>
      </div>

      <CardContent className="pt-6 pb-4 space-y-5">
        {/* STEP 1: INFO LEMBAGA */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-2">
              <Label htmlFor="nama_tenant">
                Nama Resmi Lembaga / Yayasan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama_tenant"
                placeholder="Contoh: Pondok Pesantren Tahfidz Al-Hikmah"
                value={form.nama_tenant}
                onChange={(e) => updateField("nama_tenant", e.target.value)}
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground">
                Nama lembaga yang akan tampil pada identitas sistem dan dokumen rapor
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug Subdomain Sistem <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                placeholder="alhikmah"
                value={form.slug}
                onChange={(e) =>
                  updateField(
                    "slug",
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                  )
                }
              />
              <SlugChecker
                slug={form.slug}
                isChecking={slugState.isChecking}
                isAvailable={slugState.isAvailable}
                errorMsg={slugState.errorMsg}
              />
            </div>
          </div>
        )}

        {/* STEP 2: INFO ADMIN */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-2">
              <Label htmlFor="admin_name">Nama Lengkap Administrator</Label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin_name"
                  placeholder="Ustadz Abdullah"
                  className="pl-9"
                  value={form.admin_name}
                  onChange={(e) => updateField("admin_name", e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_admin">
                Alamat Email Admin <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email_admin"
                  type="email"
                  placeholder="admin@alhikmah.sch.id"
                  className="pl-9"
                  value={form.email_admin}
                  onChange={(e) => updateField("email_admin", e.target.value)}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Digunakan untuk login dan menerima link aktivasi akun
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Kata Sandi <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    className="pl-9 pr-9"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">
                  Konfirmasi Kata Sandi <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ulangi kata sandi"
                    className="pl-9"
                    value={form.confirm_password}
                    onChange={(e) => updateField("confirm_password", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INFO SEKOLAH */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-2">
              <Label htmlFor="nama_sekolah">
                Nama Sekolah / Cabang Pertama <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <School className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="nama_sekolah"
                  placeholder="Contoh: Pesantren Tahfidz Al-Hikmah Putra"
                  className="pl-9"
                  value={form.nama_sekolah}
                  onChange={(e) => updateField("nama_sekolah", e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jenis_lembaga">Jenis Lembaga</Label>
              <Select
                value={form.jenis_lembaga}
                onValueChange={(val) => updateField("jenis_lembaga", val)}
              >
                <SelectTrigger id="jenis_lembaga" className="w-full">
                  <SelectValue placeholder="Pilih jenis lembaga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PESANTREN">Pondok Pesantren</SelectItem>
                  <SelectItem value="RUMAH_TAHFIDZ">Rumah Tahfidz</SelectItem>
                  <SelectItem value="TPQ">TPQ / TPA</SelectItem>
                  <SelectItem value="MASJID">Masjid / Majelis</SelectItem>
                  <SelectItem value="SEKOLAH_FORMAL">Sekolah Formal (SD/SMP/SMA)</SelectItem>
                  <SelectItem value="KOMUNITAS">Komunitas / Lembaga Kursus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat_sekolah">Alamat Singkat (Opsional)</Label>
              <Input
                id="alamat_sekolah"
                placeholder="Jl. Raya Utama No. 12, Jawa Barat"
                value={form.alamat_sekolah}
                onChange={(e) => updateField("alamat_sekolah", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 4: PILIH PAKET */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card Free Trial */}
              <div
                onClick={() => updateField("plan", "TRIAL")}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  form.plan === "TRIAL"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border hover:border-muted-foreground/30 bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={form.plan === "TRIAL" ? "default" : "outline"}>
                    Gratis 30 Hari
                  </Badge>
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-base text-foreground">Paket Uji Coba (Trial)</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Akses penuh ke semua fitur multi-halaqah, penilaian setoran, absensi, dan mushaf interaktif.
                </p>
                <div className="mt-4 pt-3 border-t text-xs font-semibold text-primary">
                  Rp 0 / bulan pertama
                </div>
              </div>

              {/* Card Pro / Standard */}
              <div
                onClick={() => updateField("plan", "PRO")}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  form.plan === "PRO"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border hover:border-muted-foreground/30 bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={form.plan === "PRO" ? "default" : "outline"}>
                    Direkomendasikan
                  </Badge>
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-base text-foreground">Paket Institusi</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Mendukung multi-sekolah, portal wali mandiri, custom branding logo, dan kapasitas tak terbatas.
                </p>
                <div className="mt-4 pt-3 border-t text-xs font-semibold text-primary">
                  Aktivasi langsung dengan masa trial
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: KONFIRMASI */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="rounded-xl border p-4 bg-muted/20 space-y-3 text-xs">
              <h4 className="font-bold text-sm text-foreground border-b pb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Ringkasan Pendaftaran
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-muted-foreground">Lembaga / Yayasan:</span>
                  <p className="font-semibold text-foreground text-sm">{form.nama_tenant}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Alamat Subdomain:</span>
                  <p className="font-mono text-primary font-bold">
                    https://{form.slug}.halaqah.id
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground">Email Administrator:</span>
                  <p className="font-semibold text-foreground">{form.email_admin}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Sekolah / Unit:</span>
                  <p className="font-semibold text-foreground">{form.nama_sekolah}</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center">
              Dengan mengklik tombol Daftar Sekarang, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Halaqah.id.
            </p>
          </div>
        )}
      </CardContent>

      {/* Navigation Buttons Footer */}
      <CardFooter className="flex items-center justify-between border-t p-6 bg-muted/10">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
          className="gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        {step < 5 ? (
          <Button type="button" onClick={nextStep} className="gap-1.5">
            Lanjut
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={submitRegistration}
            disabled={isSubmitting}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Daftar Sekarang
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
