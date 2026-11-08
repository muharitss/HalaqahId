// Helper to determine the tenant slug from host, query param, or environment
export const getTenantSlugFromUrl = (): string | null => {
  // 1. Query parameter override (e.g. ?tenant=pesantren-a) for dev/previewing
  if (typeof window !== "undefined" && window.location?.search) {
    const urlParam = new URLSearchParams(window.location.search).get("tenant");
    if (urlParam) {
      return urlParam.toLowerCase().trim();
    }
  }

  // 2. Backward compatibility: single tenant mode
  const isSingleMode = import.meta.env.VITE_TENANT_MODE === "single";
  if (isSingleMode) {
    return import.meta.env.VITE_DEFAULT_TENANT_SLUG || null;
  }

  // 3. Subdomain resolving
  if (typeof window !== "undefined" && window.location?.hostname) {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    // Handle local development subdomain (e.g., pesantren-a.localhost)
    if (hostname.endsWith(".localhost") && parts.length === 2) {
      return parts[0].toLowerCase();
    }

    // Handle production multi-level domain (e.g., pesantren-a.halaqah.id)
    if (parts.length > 2) {
      const subdomain = parts[0].toLowerCase();
      const reservedSubdomains = ["www", "app", "admin", "api", "portal", "staging"];
      if (!reservedSubdomains.includes(subdomain)) {
        return subdomain;
      }
    }
  }

  // 4. No explicit tenant on root or reserved domains
  return null;
};
