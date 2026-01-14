import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/utils/zodSchema";
import { akunService } from "@/services/akunService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, faLock, faUser, faEye, faEyeSlash, faExclamationCircle 
} from "@fortawesome/free-solid-svg-icons";

interface AkunFormProps {
  onSuccess?: () => void;
}

export function AkunForm({ onSuccess }: AkunFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const response = await akunService.registerMuhafiz({
        email: values.email,
        username: values.username,
        password: values.password
      });

      if (response.success) {
        toast.success("Akun muhafiz berhasil dibuat!");
        form.reset();
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Terjadi kesalahan sistem";
      setErrorMessage(message);
      if (error.response?.status === 400 && message.includes("Email")) {
        form.setError("email", { type: "manual", message: "Email sudah terdaftar" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        
        {errorMessage && (
          <Alert variant="destructive">
            <FontAwesomeIcon icon={faExclamationCircle} className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-2">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-muted-foreground text-sm" />
                    <Input {...field} type="email" placeholder="muhafiz@email.com" className="pl-10" disabled={isLoading} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-muted-foreground text-sm" />
                    <Input {...field} placeholder="Username muhafiz" className="pl-10" disabled={isLoading} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Passwords - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-muted-foreground text-sm" />
                      <Input {...field} type={showPassword ? "text" : "password"} className="pl-10 pr-10" disabled={isLoading} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-muted-foreground" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-muted-foreground text-sm" />
                      <Input {...field} type={showConfirmPassword ? "text" : "password"} className="pl-10 pr-10" disabled={isLoading} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-muted-foreground" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
          <FormDescription className="mr-auto text-xs text-left max-w-[200px]">
            Akun akan langsung aktif setelah disimpan.
          </FormDescription>
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? (
              <><Spinner className="mr-2" /> Menyimpan...</>
            ) : (
              "Simpan Akun Muhafiz"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}