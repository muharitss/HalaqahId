import React from "react";
import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  language?: string;
  themeColor?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Halaqah ID",
  description = "Aplikasi manajemen halaqah, monitoring perkembangan hafalan santri, dan administrasi tahfidz modern.",
  keywords = "aplikasi halaqah, aplikasi tahfidz, monitoring hafalan, administrasi tahfidz, tahfidz quran",
  canonical,
  robots = "index, follow",
  author = "Halaqah ID Team",
  ogType = "website",
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  jsonLd,
  language = "id",
  themeColor = "#0284c7", // Sky 600 default
}) => {
  const finalTitle = title.includes("Halaqah ID") ? title : `${title} | Halaqah ID`;
  const currentUrl = canonical || window.location.href;

  const defaultOgImage = ogImage || "https://halaqah-id.vercel.app/og-image-default.png";
  const defaultTwitterImage = twitterImage || defaultOgImage;

  return (
    <Helmet>
      {/* HTML Language */}
      <html lang={language} />

      {/* Basic Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={currentUrl} />
      <meta name="theme-color" content={themeColor} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

      {/* Open Graph Tags */}
      <meta property="og:site_name" content="Halaqah ID" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || finalTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:url" content={ogUrl || currentUrl} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || finalTitle} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={defaultTwitterImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
