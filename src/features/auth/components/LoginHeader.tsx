import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

export function LoginHeader() {
  return (
    <>
      <div className="absolute top-10 left-10 z-20 hidden lg:flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
          <FontAwesomeIcon icon={faBookOpen} />
        </div>
        <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">
          HalaqahId
        </span>
      </div>

      <div className="absolute left-8 top-8 flex items-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <FontAwesomeIcon icon={faBookOpen} />
        </div>
        <span className="text-xl font-bold dark:text-white">HalaqahId</span>
      </div>
    </>
  );
}