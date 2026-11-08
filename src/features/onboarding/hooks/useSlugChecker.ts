import { useState, useEffect } from "react";
import { onboardingApi } from "../api/onboarding.api";

const SLUG_REGEX = /^[a-z0-9-]+$/;

export function useSlugChecker(rawSlug: string) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanSlug = rawSlug.trim().toLowerCase();
  const isFormatValid = cleanSlug.length >= 3 && SLUG_REGEX.test(cleanSlug);

  useEffect(() => {
    if (!cleanSlug) {
      setIsChecking(false);
      setIsAvailable(null);
      setErrorMsg(null);
      return;
    }

    if (cleanSlug.length < 3) {
      setIsChecking(false);
      setIsAvailable(null);
      setErrorMsg("Slug minimal 3 karakter");
      return;
    }

    if (!SLUG_REGEX.test(cleanSlug)) {
      setIsChecking(false);
      setIsAvailable(null);
      setErrorMsg("Hanya boleh huruf kecil, angka, dan strip (-)");
      return;
    }

    setErrorMsg(null);
    setIsChecking(true);
    setIsAvailable(null);

    const timer = setTimeout(async () => {
      try {
        const result = await onboardingApi.checkSlug(cleanSlug);
        setIsAvailable(result.available);
        if (!result.available) {
          setErrorMsg("Slug sudah digunakan oleh lembaga lain");
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        const msg = error.response?.data?.message || "Gagal memeriksa slug";
        setErrorMsg(msg);
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [cleanSlug]);

  return {
    cleanSlug,
    isFormatValid,
    isChecking,
    isAvailable,
    errorMsg,
  };
}
