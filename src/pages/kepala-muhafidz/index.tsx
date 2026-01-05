import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";

export default function KepalaMuhafidzPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-light p-6 dark:bg-background-dark">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-surface-dark">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FontAwesomeIcon icon={faUserShield} size="2x" />
          </div>
          <h1 className="text-2xl font-bold font-display">Dashboard Kepala Musyrif</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Selamat datang, {user?.nama || user?.email}
          </p>
        </div>

        <Button 
          onClick={logout}
          variant="destructive" 
          className="w-full h-12 gap-2"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Keluar dari Sistem
        </Button>
      </div>
    </div>
  );
}