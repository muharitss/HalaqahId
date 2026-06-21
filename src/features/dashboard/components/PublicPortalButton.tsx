import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const PublicPortalButton = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      className="w-full h-11 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
      onClick={() => navigate("/display")}
    >
      <FontAwesomeIcon icon={faUsersViewfinder} className="text-primary" />
      Portal Informasi Santri 
    </Button>
  );
};