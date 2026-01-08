import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/utils/zodSchema";
import { akunService } from "@/services/akunService";

// Import UI Components
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

// Import Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faLock, 
  faUserPlus,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";

interface AkunFormProps {
  onSuccess?: () => void;
}

export function AkunForm({ onSuccess }: AkunFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Kirim data ke backend (hanya email dan password sesuai dokumentasi)
      const response = await akunService.registerMuhafiz({
        email: values.email,
        username: values.username,
        password: values.password
      });

      if (response.success) {
        setSuccessMessage(`Akun muhafidz berhasil dibuat! Email: ${values.email}`);
        form.reset();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const message = error.response?.data?.message || "Terjadi kesalahan saat membuat akun";
      setErrorMessage(message);
      
      // Set error ke form field jika email sudah terdaftar
      if (error.response?.status === 400 && message.includes("Email sudah terdaftar")) {
        form.setError("email", { 
          type: "manual", 
          message: "Email sudah terdaftar" 
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {successMessage && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
          <AlertDescription>
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
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
                      placeholder="muhafiz@example.com"
                      disabled={isLoading}
                      className="h-12 pl-10 border-[#d6e7d0] dark:border-gray-600 bg-background-light dark:bg-surface-dark focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium dark:text-white">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Username"
                    disabled={isLoading}
                    className="h-12 border-[#d6e7d0] dark:border-gray-600 bg-background-light dark:bg-surface-dark focus:ring-2 focus:ring-primary transition-all"
                  />
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
                <FormLabel className="text-sm font-medium dark:text-white">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-gray-400">
                      <FontAwesomeIcon icon={faLock} className="text-[18px]" />
                    </span>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      disabled={isLoading}
                      className="h-12 pl-10 pr-10 border-[#d6e7d0] dark:border-gray-600 bg-background-light dark:bg-surface-dark focus:ring-2 focus:ring-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-[18px]" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium dark:text-white">
                  Konfirmasi Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-gray-400">
                      <FontAwesomeIcon icon={faLock} className="text-[18px]" />
                    </span>
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      disabled={isLoading}
                      className="h-12 pl-10 pr-10 border-[#d6e7d0] dark:border-gray-600 bg-background-light dark:bg-surface-dark focus:ring-2 focus:ring-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-[18px]" />
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
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/20 mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Membuat Akun...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserPlus} />
                Buat Akun Muhafidz
              </span>
            )}
          </Button>

          {/* Informasi Tambahan */}
          <div className="pt-4 border-t border-border/50 dark:border-border-dark/50">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
              Akun yang dibuat akan langsung aktif dan dapat digunakan untuk login oleh muhafidz.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}