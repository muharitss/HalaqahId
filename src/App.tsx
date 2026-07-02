import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { ThemeProvider } from "@/store/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query";
import { router } from "@/routes";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        {/* AuthProvider di luar RouterProvider agar context tersedia di semua route elements */}
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            richColors
            closeButton
          />
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
