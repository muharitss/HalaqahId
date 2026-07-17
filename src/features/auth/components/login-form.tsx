import { Link } from "react-router-dom";
import { useLoginForm } from "../hooks/useLoginForm";

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
import { CheckCircle2 } from "lucide-react";

export function LoginForm() {
  const {
    form,
    showPassword,
    setShowPassword,
    backendError,
    isSubmitting,
    showResend,
    isResending,
    successMessage,
    onSubmit,
    handleResend,
    clearMessages,
  } = useLoginForm();

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
            {successMessage && (
              <Alert className="animate-in fade-in zoom-in duration-300 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {backendError && (
              <div className="space-y-2">
                {backendError.includes("telah dikirim ulang") ? (
                  <Alert className="animate-in fade-in zoom-in duration-300 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription>{backendError}</AlertDescription>
                  </Alert>
                ) : showResend ? (
                  <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                    <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 text-amber-900 dark:text-amber-200">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <AlertDescription className="text-amber-800 dark:text-amber-300">
                        <span className="font-semibold block mb-1">Akun Belum Terverifikasi</span>
                        Login gagal karena email Anda belum diverifikasi. Silakan lakukan verifikasi ulang terlebih dahulu.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResend}
                      disabled={isResending}
                      className="w-full border-amber-300 hover:bg-amber-50 text-amber-900 dark:text-amber-200 dark:border-amber-900/50 dark:hover:bg-amber-950/30 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      {isResending ? (
                        <><Spinner className="h-4 w-4" /> Mengirim...</>
                      ) : (
                        "Verifikasi Ulang"
                      )}
                    </Button>
                  </div>
                ) : (
                  <Alert variant="destructive" className="animate-in fade-in zoom-in duration-300">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4" />
                    <AlertDescription>{backendError}</AlertDescription>
                  </Alert>
                )}
              </div>
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
                          clearMessages();
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
                          clearMessages();
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

      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground w-full">
          Belum mendaftarkan institusi Anda?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Daftar Sekarang
          </Link>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Masalah login? Hubungi administrator sistem
        </p>
      </CardFooter>
    </Card>
  );
}

