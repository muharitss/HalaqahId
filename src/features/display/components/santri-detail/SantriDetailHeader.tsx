import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SantriDetailHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={() => navigate("/display")} className="gap-2 hover:bg-card">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Button>
      <ThemeToggle />
    </div>
  );
}