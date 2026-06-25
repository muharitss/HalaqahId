import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SantriDetailHeaderProps {
  santriName?: string;
}

export function SantriDetailHeader({ santriName }: SantriDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="mx-auto max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <button
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Portal
              </button>
            </div>
            {santriName && (
              <>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                <span className="text-foreground font-semibold truncate max-w-[180px]">
                  {santriName}
                </span>
              </>
            )}
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
