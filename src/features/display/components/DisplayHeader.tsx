import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DisplayHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="mx-auto max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-9 w-9 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none text-foreground">HalaqahID</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Portal Informasi Santri</p>
            </div>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
