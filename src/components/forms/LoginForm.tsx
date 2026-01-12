import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "@/utils/zodSchema";
import { useAuth } from "@/context/AuthContext";

// Import Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

// Import FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faLock, 
  faArrowRight, 
  faEye, 
  faEyeSlash,
  faTriangleExclamation 
} from "@fortawesome/free-solid-svg-icons";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [backendError, setBackendError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setBackendError("");
    setIsSubmitting(true);

    try {
      await login(values);
      navigate("/", { replace: true });
    } catch (error: any) {
      let errorMessage = "Terjadi kesalahan saat login";
      
      if (error.response) {
        const status = error.response.status;
        
        // Standar Keamanan: Pesan yang sama untuk 401 (Unauthorized) dan 404 (Not Found)
        if (status === 401 || status === 404) {
          errorMessage = "Email atau password yang Anda masukkan salah";
        } else if (status === 429) {
          errorMessage = "Terlalu banyak percobaan login. Silakan tunggu sebentar";
        } else if (status >= 500) {
          errorMessage = "Masalah koneksi ke server. Silakan coba lagi nanti";
        }
      } else {
        errorMessage = "Gagal terhubung ke server. Periksa koneksi internet Anda";
      }
      
      setBackendError(errorMessage);
      
      // Keamanan tambahan: Selalu hapus password saat terjadi error
      form.setValue("password", "");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handler untuk mencegah form submission default dan reload
  // const handleFormSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   form.handleSubmit(onSubmit)();
  // };

  // Reset error ketika user mulai mengetik
  const handleInputChange = () => {
    if (backendError) {
      setBackendError("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        
        {backendError && (
          <Alert variant="destructive" className="animate-in fade-in duration-300">
            <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {backendError}
            </AlertDescription>
          </Alert>
        )}

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium dark:text-white">
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-gray-400">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[18px]" />
                  </span>
                  <Input
                    {...field}
                    type="email"
                    placeholder="ustadz@example.com"
                    disabled={isSubmitting}
                    className="h-12 pl-10 border-[#d6e7d0] dark:border-gray-600 bg-background-light dark:bg-surface-dark focus:ring-2 focus:ring-primary transition-all"
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange();
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium dark:text-white">
                  Password
                </FormLabel>
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:text-primary-dark hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot Password?
                </a>
              </div>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-gray-400">
                    <FontAwesomeIcon icon={faLock} className="text-[18px]" />
                  </span>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    disabled={isSubmitting}
                    className="h-12 pl-10 pr-10 border-[#d6e7d0] dark:border-gray-600 bg-background-light dark:bg-surface-dark focus:ring-2 focus:ring-primary transition-all"
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light hover:text-primary transition-colors"
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-[18px]" />
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              Memproses...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </span>
          )}
        </Button>

        {backendError && (
          <div className="pt-2 text-center">
            <p className="text-xs text-text-secondary-light dark:text-gray-400">
              {backendError.includes("salah") 
                ? "Periksa kembali email dan password Anda. Perhatikan huruf besar/kecil."
                : backendError.includes("tidak ditemukan")
                ? "Email tidak terdaftar. Pastikan email yang dimasukkan benar."
                : "Silakan coba lagi atau hubungi administrator."}
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}