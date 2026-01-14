import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AppRouter } from "@/routes";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

function App() {
  return (
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
  );
}

export default App;