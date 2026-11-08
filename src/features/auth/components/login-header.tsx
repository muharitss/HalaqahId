import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useTenant } from "@/store/tenant-context";

interface LoginHeaderProps {
  variant?: "desktop" | "mobile" | "all";
}

export function LoginHeader({ variant = "all" }: LoginHeaderProps) {
  const { brand } = useTenant();

  return (
    <>
      {(variant === "all" || variant === "desktop") && (
        <div className="absolute top-10 left-10 z-20 hidden lg:flex items-center gap-3">
          {brand?.logo_url ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden bg-white shadow-lg">
              <img src={brand.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
          )}
          <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">
            {brand?.nama_aplikasi || "HalaqahId"}
          </span>
        </div>
      )}

      {(variant === "all" || variant === "mobile") && (
        <div className="flex items-center gap-3 lg:hidden">
          {brand?.logo_url ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden bg-white shadow-md border">
              <img src={brand.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-md">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
          )}
          <span className="text-xl font-bold text-foreground">{brand?.nama_aplikasi || "HalaqahId"}</span>
        </div>
      )}
    </>
  );
}

