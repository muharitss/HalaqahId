import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserTie } from "@fortawesome/free-solid-svg-icons";

export default function MuhafidzPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-light p-6 dark:bg-background-dark">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-surface-dark">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FontAwesomeIcon icon={faUserTie} size="2x" />
          </div>
          <h1 className="text-2xl font-bold font-display">Dashboard Muhafidz</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Assalamu'alaikum, {user?.nama || user?.email}
          </p>
        </div>

        <Button 
          onClick={logout}
          className="w-full h-12 gap-2 bg-primary hover:bg-primary-dark"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </Button>
      </div>
    </div>
  );
}