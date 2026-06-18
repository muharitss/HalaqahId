import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-125 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <FontAwesomeIcon icon={faShieldHalved} className="text-6xl text-destructive" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Akses Ditolak</h2>
      <p className="text-muted-foreground mt-2 max-w-75 text-center">
        Maaf, halaman ini hanya dapat diakses oleh administrator pusat.
      </p>
    </div>
  );
}