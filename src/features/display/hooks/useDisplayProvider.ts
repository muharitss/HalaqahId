import { useMemo, useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSantriList } from "../api";
import { type DisplaySantri } from "../types";

export function useDisplayProvider() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [token, setTokenState] = useState<string>(() => {
    if (tokenFromUrl) return tokenFromUrl;
    if (slug) {
      return sessionStorage.getItem(`display_token_${slug}`) || "";
    }
    return "";
  });

  useEffect(() => {
    if (tokenFromUrl) {
      setTokenState(tokenFromUrl);
      if (slug) {
        sessionStorage.setItem(`display_token_${slug}`, tokenFromUrl);
      }
    } else if (slug) {
      const stored = sessionStorage.getItem(`display_token_${slug}`);
      if (stored) {
        setTokenState(stored);
      }
    }
  }, [slug, tokenFromUrl]);

  const updateToken = (newToken: string) => {
    setTokenState(newToken);
    if (slug) {
      sessionStorage.setItem(`display_token_${slug}`, newToken);
    }
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newToken) {
        next.set("token", newToken);
      } else {
        next.delete("token");
      }
      return next;
    });
  };

  const { data, isLoading, error, refetch } = useSantriList(slug, token || undefined);

  const santriList = useMemo((): DisplaySantri[] => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const refreshSantri = async () => {
    await refetch();
  };

  return {
    slug,
    token,
    setToken: updateToken,
    santriList,
    isLoading,
    error,
    refreshSantri,
  };
}
