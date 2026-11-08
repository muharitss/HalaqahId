import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground">
          <div className="max-w-md w-full text-center space-y-6 p-8 border rounded-2xl shadow-sm bg-card">
            <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Terjadi Kendala Teknis</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Halaman mengalami kendala saat memuat data. Silakan muat ulang halaman atau kembali ke beranda.
              </p>
              {this.state.error?.message && (
                <div className="p-3 bg-muted/60 rounded-lg text-xs font-mono text-muted-foreground text-left overflow-x-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={this.handleGoHome} className="gap-2">
                <Home className="h-4 w-4" />
                Beranda
              </Button>
              <Button size="sm" onClick={this.handleReload} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Muat Ulang
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
