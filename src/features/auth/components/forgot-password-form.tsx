import { Link } from "react-router-dom";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

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
import { faEnvelope, faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ForgotPasswordForm() {
  const {
    form,
    isSubmitting,
    isSubmitted,
    submittedEmail,
    backendError,
    onSubmit,
    handleResetForm,
    clearMessages,
  } = useForgotPasswordForm();

  if (isSubmitted) {
    return (
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm">
        <CardHeader className="space-y-2 text-center sm:text-left">
          <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Periksa Email Anda</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Jika alamat email <strong className="text-foreground">{submittedEmail}</strong> terdaftar di sistem, tautan pemulihan kata sandi telah dikirimkan.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert className="bg-muted/50 border-muted text-muted-foreground text-xs leading-relaxed">
            <AlertDescription>
              Silakan cek folder inbox atau spam/promosi di email Anda. Tautan pemulihan berlaku selama waktu terbatas.
            </AlertDescription>
          </Alert>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResetForm}
          >
            Kirim ke email lain
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
        <CardTitle className="text-2xl font-bold tracking-tight">Lupa Password</CardTitle>
        <CardDescription>
          Masukkan alamat email akun Anda untuk menerima tautan pemulihan kata sandi
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" /> Mengirim Tautan...
                </>
              ) : (
                <>
                  Kirim Tautan Reset
                  <FontAwesomeIcon icon={faPaperPlane} className="ml-2 h-3.5 w-3.5" />
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
