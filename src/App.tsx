import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { ThemeProvider } from "@/store/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query";
import { AppRouter } from "@/routes";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
            <Toaster 
              position="top-center" 
              richColors 
              closeButton 
              theme="light"
            />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
