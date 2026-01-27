import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "@/utils/zodSchema";
import { useAuth } from "@/context/AuthContext";

// Shadcn UI Components
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

// Icons
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
      if (error.response?.status === 401 || error.response?.status === 404) {
        errorMessage = "Email atau password salah";
      } else if (error.response?.status === 429) {
        errorMessage = "Terlalu banyak percobaan. Tunggu sebentar.";
      }
      setBackendError(errorMessage);
      form.setValue("password", "");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
        <CardDescription>
          Masukkan email dan password untuk mengakses dashboard
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {backendError && (
              <Alert variant="destructive" className="animate-in fade-in zoom-in duration-300">
                <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4" />
                <AlertDescription>{backendError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faEnvelope} 
                        className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" 
                      />
                      <Input
                        {...field}
                        type="email"
                        placeholder="nama@contoh.com"
                        className="pl-10"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          field.onChange(e);
                          if (backendError) setBackendError("");
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faLock} 
                        className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" 
                      />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          field.onChange(e);
                          if (backendError) setBackendError("");
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        <FontAwesomeIcon 
                          icon={showPassword ? faEyeSlash : faEye} 
                          className="h-4 w-4 text-muted-foreground" 
                        />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Spinner className="mr-2" /> Authenticating...</>
              ) : (
                <>
                  Sign In 
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <p className="text-xs text-center text-muted-foreground">
          Masalah login? Hubungi administrator sistem
        </p>
      </CardFooter>
    </Card>
  );
}