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
import { toast } from "sonner";

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
      const response = await akunService.registerMuhafiz({
        email: values.email,
        username: values.username,
        password: values.password
      });

      if (response.success) {
        setSuccessMessage(`Akun muhafidz berhasil dibuat! Email: ${values.email}`);
        form.reset();
        if (onSuccess) onSuccess();
        toast.success("Akun muhafidz berhasil dibuat!");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const message = error.response?.data?.message || "Terjadi kesalahan saat membuat akun";
      setErrorMessage(message);
      toast.error(message);
      
      if (error.response?.status === 400 && message.includes("Email sudah terdaftar")) {
        form.setError("email", { type: "manual", message: "Email sudah terdaftar" });
        toast.error("Email sudah terdaftar");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 text-left">
          
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <Input
                      {...field}
                      type="email"
                      placeholder="muhafiz@example.com"
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Username"
                    disabled={isLoading}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      disabled={isLoading}
                      className="pl-10 pr-10 h-11"
                    />
                    {/* Shadcn Button sebagai toggle password */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 px-0 hover:bg-transparent text-muted-foreground hover:text-primary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Konfirmasi Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      disabled={isLoading}
                      className="pl-10 pr-10 h-11"
                    />
                    {/* Shadcn Button sebagai toggle password */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 px-0 hover:bg-transparent text-muted-foreground hover:text-primary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button Utama */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-4"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Membuat Akun...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Buat Akun Muhafidz
              </>
            )}
          </Button>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Akun yang dibuat akan langsung aktif dan dapat digunakan untuk login.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}