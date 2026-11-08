import { Link } from "react-router-dom";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

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
  faLock,
  faEye,
  faEyeSlash,
  faArrowLeft,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { AlertCircle, AlertTriangle } from "lucide-react";

export function ResetPasswordForm() {
  const {
    form,
    hasToken,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    backendError,
    isSubmitting,
    onSubmit,
    clearMessages,
  } = useResetPasswordForm();

  if (!hasToken) {
    return (
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm">
        <CardHeader className="space-y-2 text-center sm:text-left">
          <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Tautan Tidak Lengkap</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Token reset password tidak ditemukan di tautan ini. Silakan pastikan Anda membuka tautan lengkap yang dikirimkan ke email Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/forgot-password">Kirim Ulang Permintaan Reset</Link>
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
            Kembali ke Login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Buat Password Baru</CardTitle>
        <CardDescription>
          Masukkan kata sandi baru untuk akun Anda (minimal 8 karakter)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {backendError && (
              <Alert variant="destructive" className="animate-in fade-in zoom-in duration-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{backendError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password_baru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                      />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password Baru</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                      />
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
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
                <>
                  <Spinner className="mr-2" /> Menyimpan Password...
                </>
              ) : (
                <>
                  Simpan Password Baru
                  <FontAwesomeIcon icon={faKey} className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-4">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
          Kembali ke Login
        </Link>
      </CardFooter>
    </Card>
  );
}
