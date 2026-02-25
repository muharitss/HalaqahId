import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function PublicAccessButton() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau akses publik
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
        onClick={() => navigate("/display")}
      >
        <FontAwesomeIcon icon={faUsersViewfinder} className="text-primary" />
        Portal Informasi Santri
      </Button>
    </div>
  );
}