import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSpinner, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { muhafizService } from "@/features/muhafiz/api/muhafizService"; // Langsung import dari feature
import { getErrorMessage } from "@/utils/error";

const akunSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type AkunFormValues = z.infer<typeof akunSchema>;

interface AkunFormProps {
  onSuccess?: () => void;
}

export function AkunForm({ onSuccess }: AkunFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AkunFormValues>({
    resolver: zodResolver(akunSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AkunFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await muhafizService.createMuhafiz({  // Ganti authService dengan muhafizService
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      if (response.success) {
        reset();
        setShowSuccessDialog(true);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Gagal membuat akun"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Masukkan nama"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Masukkan email"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Minimal 6 karakter"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Membuat Akun...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Buat Akun Muhafiz
          </>
        )}
      </Button>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-primary">Akun Berhasil Dibuat!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base mt-2">
              Akun muhafiz telah berhasil didaftarkan. <br/><br/>
              Harap informasikan kepada muhafiz untuk memeriksa kotak masuk (inbox) atau folder spam email mereka guna <strong>memverifikasi akun</strong> sebelum dapat melakukan login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-6">
            <AlertDialogAction onClick={() => {
              setShowSuccessDialog(false);
              if (onSuccess) onSuccess();
            }} className="w-full sm:w-auto">
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}