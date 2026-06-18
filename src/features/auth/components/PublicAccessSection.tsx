import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function PublicAccessSection() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau akses publik
          </span>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="w-full h-11" 
        onClick={() => navigate("/display")}
      >
        <Users className="mr-2 h-4 w-4" />
        Portal Informasi Santri
      </Button>
    </div>
  );
}