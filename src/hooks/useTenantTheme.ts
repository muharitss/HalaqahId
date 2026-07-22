import { useEffect } from "react";
import { useTenant } from "@/store/tenant-context";

export function useTenantTheme() {
  const { brand } = useTenant();

  // 1. Terapkan warna kustom dari TenantBrand ke CSS variables
  useEffect(() => {
    if (brand?.warna_primer) {
      document.documentElement.style.setProperty("--primary", brand.warna_primer);
      document.documentElement.style.setProperty("--sidebar-primary", brand.warna_primer);
      document.documentElement.style.setProperty("--ring", brand.warna_primer);
    } else {
      // Reset to default green oklch value from index.css if not present
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--sidebar-primary");
      document.documentElement.style.removeProperty("--ring");
    }

    if (brand?.warna_sekunder) {
      document.documentElement.style.setProperty("--secondary", brand.warna_sekunder);
    } else {
      document.documentElement.style.removeProperty("--secondary");
    }
  }, [brand?.warna_primer, brand?.warna_sekunder]);

  // 2. Terapkan nama aplikasi secara dinamis ke title dokumen
  useEffect(() => {
    if (brand?.nama_aplikasi) {
      document.title = brand.nama_aplikasi;
    } else {
      document.title = "Halaqah.id";
    }
  }, [brand?.nama_aplikasi]);

  // 3. Terapkan favicon kustom secara dinamis
  useEffect(() => {
    if (brand?.favicon_url) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = brand.favicon_url;
    }
  }, [brand?.favicon_url]);
}
