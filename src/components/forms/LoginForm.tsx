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

// Import FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faLock, 
  faArrowRight, 
  faEye, 
  faEyeSlash 
} from "@fortawesome/free-solid-svg-icons";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      // Menjalankan fungsi login dari AuthContext
      await login(values);
      
      // Redirect manual (opsional, karena biasanya ProtectedRoute akan menangani ini)
      // Namun untuk UX yang baik, kita arahkan ke root/dashboard
      navigate("/");
      
      console.log("Login sukses, mengalihkan...");
    } catch (error) {
      console.error("Login failed:", error);
      // Anda bisa menambahkan toast error di sini nanti
    }
  }

  return (
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
                    placeholder="ustadz@example.com"
                    disabled={isLoading}
                    className="h-12 pl-10 border-[#d6e7d0] dark:border-gray-600 bg-background-light dark:bg-surface-dark focus:ring-2 focus:ring-primary transition-all"
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mohon tunggu...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}