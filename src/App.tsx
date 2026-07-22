import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { TenantProvider } from "@/store/tenant-context";
import { useAuthStore } from "@/store/useAuthStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query";
import { router } from "@/routes";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsWrapper } from "@/components/custom/seo/AnalyticsWrapper";
import "./App.css";

function App() {
  useEffect(() => {
    useAuthStore.getState().refreshUser();
  }, []);

  return (
    <HelmetProvider>
      <AnalyticsWrapper>
        <QueryClientProvider client={queryClient}>
          <TenantProvider>
            {/* AuthProvider wraps the application to preserve compatability facades */}
            <AuthProvider>
              <RouterProvider router={router} />
              <Toaster
                position="top-center"
                richColors
                closeButton
              />
            </AuthProvider>
          </TenantProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AnalyticsWrapper>
    </HelmetProvider>
  );
}

export default App;
