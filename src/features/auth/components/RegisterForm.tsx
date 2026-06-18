import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faUser, faEnvelope, faLock, faBuilding, faMapMarkerAlt, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authService } from "@/features/auth/services/authService";
import { registerAdminSchema, type RegisterFormValues } from "@/utils/zodSchema";

export function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerAdminSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        nama_sekolah: data.nama_sekolah,
        alamat: data.alamat,
      };

      const res = await authService.registerAdmin(payload);
      toast.success(res.message || "Pendaftaran berhasil!");
      
      // Tampilkan dialog sukses
      setShowSuccessDialog(true);
    } catch (error: any) {
      toast.error(error.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Profil Admin */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Data Administrator</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <Input
              id="name"
              placeholder="Fulan bin Fulan"
              className="pl-10"
              disabled={isLoading}
              {...register("name")}
            />
          </div>
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="admin@ponpes.com"
              className="pl-10"
              disabled={isLoading}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                disabled={isLoading}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                disabled={isLoading}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
        </div>
      </div>

      <div className="my-4 border-t border-border"></div>

      {/* Profil Sekolah */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Data Sekolah / Pondok</h3>
        
        <div className="space-y-2">
          <Label htmlFor="nama_sekolah">Nama Lembaga</Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <Input
              id="nama_sekolah"
              placeholder="Ponpes Al-Hikmah"
              className="pl-10"
              disabled={isLoading}
              {...register("nama_sekolah")}
            />
          </div>
          {errors.nama_sekolah && <p className="text-xs text-destructive">{errors.nama_sekolah.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="alamat">Alamat Lembaga (Opsional)</Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <Input
              id="alamat"
              placeholder="Jl. Merdeka No. 10, Jakarta"
              className="pl-10"
              disabled={isLoading}
              {...register("alamat")}
            />
          </div>
          {errors.alamat && <p className="text-xs text-destructive">{errors.alamat.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full mt-6" disabled={isLoading}>
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
            Mendaftarkan...
          </>
        ) : (
          "Daftar Sekarang"
        )}
      </Button>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Sudah memiliki akun?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Masuk di sini
        </Link>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-primary">Pendaftaran Berhasil!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base mt-2">
              Akun Anda telah berhasil didaftarkan. <br/><br/>
              Silakan periksa kotak masuk (inbox) atau folder spam email Anda untuk <strong>memverifikasi akun</strong> sebelum melakukan login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-6">
            <AlertDialogAction onClick={() => navigate("/login")} className="w-full sm:w-auto">
              Menuju Halaman Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
