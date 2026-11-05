import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { School, UserCheck, Phone, IdCard, Loader2, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { portalLoginSchema, type PortalLoginFormData } from "../validation/portal.schema";
import { portalService } from "../api/services/portalService";
import { usePortalContext } from "../store/portal-context";

export function PortalLoginPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { login, isAuthenticated, session } = usePortalContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialSlug = slug || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PortalLoginFormData>({
    resolver: zodResolver(portalLoginSchema),
    defaultValues: {
      slug_sekolah: initialSlug,
      nis: "",
      no_telepon: "",
    },
  });

  useEffect(() => {
    if (slug) {
      setValue("slug_sekolah", slug);
    }
  }, [slug, setValue]);

  // If already logged in for this school, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && session?.sekolah.slug) {
      const targetSlug = slug || session.sekolah.slug;
      navigate(`/${targetSlug}/portal/dashboard`, { replace: true });
    }
  }, [isAuthenticated, session, slug, navigate]);

  const onSubmit = async (data: PortalLoginFormData) => {
    setErrorMessage(null);
    try {
      const sessionData = await portalService.verify({
        slug_sekolah: data.slug_sekolah,
        nis: data.nis,
        no_telepon: data.no_telepon,
      });

      login(sessionData);
      toast.success(`Selamat datang, ${sessionData.wali.nama_wali}`);
      navigate(`/${sessionData.sekolah.slug}/portal/dashboard`, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verifikasi data portal gagal";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1 shadow-xs">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Portal Orang Tua &amp; Wali
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Akses pemantauan progres hafalan, absensi, dan nilai ujian santri
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border-border/80 shadow-sm bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Verifikasi Akses Wali</CardTitle>
            <CardDescription className="text-xs">
              Masukkan Nomor Induk Santri (NIS) dan Nomor Telepon yang terdaftar.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive" className="text-xs py-2">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Sekolah / Slug */}
              <div className="space-y-1.5">
                <Label htmlFor="slug_sekolah" className="text-xs font-medium">
                  ID / Slug Lembaga
                </Label>
                <div className="relative">
                  <School className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="slug_sekolah"
                    placeholder="contoh: nurul-quran"
                    className="pl-9 text-xs h-9"
                    readOnly={!!slug}
                    {...register("slug_sekolah")}
                  />
                </div>
                {errors.slug_sekolah && (
                  <p className="text-[11px] text-destructive">{errors.slug_sekolah.message}</p>
                )}
              </div>

              {/* NIS */}
              <div className="space-y-1.5">
                <Label htmlFor="nis" className="text-xs font-medium">
                  Nomor Induk Santri (NIS)
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nis"
                    placeholder="Masukkan NIS putra/putri Anda"
                    className="pl-9 text-xs h-9"
                    autoComplete="username"
                    {...register("nis")}
                  />
                </div>
                {errors.nis && (
                  <p className="text-[11px] text-destructive">{errors.nis.message}</p>
                )}
              </div>

              {/* Nomor Telepon Wali */}
              <div className="space-y-1.5">
                <Label htmlFor="no_telepon" className="text-xs font-medium">
                  Nomor Telepon Wali Santri
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="no_telepon"
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    className="pl-9 text-xs h-9"
                    autoComplete="tel"
                    {...register("no_telepon")}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Gunakan nomor yang terdaftar di pihak halaqah/pesantren
                </p>
                {errors.no_telepon && (
                  <p className="text-[11px] text-destructive">{errors.no_telepon.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                className="w-full text-xs font-semibold h-10 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Masuk ke Portal
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground">
          Mengalami kendala login? Silakan hubungi koordinator atau admin tahfidz sekolah Anda.
        </p>
      </div>
    </div>
  );
}

export default PortalLoginPage;
