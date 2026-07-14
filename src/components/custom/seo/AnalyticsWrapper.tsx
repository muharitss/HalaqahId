import React, { useEffect, useState } from "react";
import axios from "axios";

interface SeoSettings {
  seo_google_verification?: string;
  seo_analytics_id?: string;
  seo_favicons?: string;
  seo_logo?: string;
  seo_site_title?: string;
  seo_default_description?: string;
  seo_default_keywords?: string;
}

export const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SeoSettings | null>(null);

  useEffect(() => {
    // Fetch public SEO settings
    const fetchSeoSettings = async () => {
      try {
        const response = await axios.get("/api/seo/settings");
        if (response.data && response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan SEO publik:", error);
      }
    };

    fetchSeoSettings();
  }, []);

  useEffect(() => {
    if (!settings) return;

    // 1. Google Search Console Verification
    if (settings.seo_google_verification) {
      // Check if tag already exists
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "google-site-verification");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", settings.seo_google_verification);
    }

    // 2. Google Analytics 4 (GA4) Integration
    if (settings.seo_analytics_id) {
      const gaId = settings.seo_analytics_id;

      // Check if GA script already exists
      const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`);
      if (!existingScript) {
        // Load GTAG JS
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // Configure GTAG inline script
        const inlineScript = document.createElement("script");
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `;
        document.head.appendChild(inlineScript);

        console.log(`Google Analytics 4 (${gaId}) initialized.`);
      }
    }

    // 3. Dynamic Favicon Injection (optional/advanced)
    if (settings.seo_favicons) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.setAttribute("rel", "icon");
        document.head.appendChild(favicon);
      }
      favicon.setAttribute("href", settings.seo_favicons);
    }
  }, [settings]);

  // Track page views on React Router route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (settings?.seo_analytics_id && typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("config", settings.seo_analytics_id, {
          page_path: window.location.pathname,
        });
      }
    };

    // Watch popstate or window history changes for SPA routing
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [settings]);

  return <>{children}</>;
};
