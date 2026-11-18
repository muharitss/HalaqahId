import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";
import {
  LandingPage,
  AboutPage,
  FeaturesPage,
  ContactPage,
  FaqPage,
} from "@/features/landing";
import { BlogListPage, BlogDetailPage } from "@/features/blog";
import { DisplayProvider } from "@/features/display";
import { PortalWaliPage } from "@/features/portal/pages/PortalWaliPage";

const PublicDisplay = lazy(() => import("@/features/display/pages/PublicDisplay"));
const SantriDetail = lazy(() => import("@/features/display/pages/SantriDetail"));

export const publicRoutes: RouteObject[] = [
  // ── Public: Display Portal (wajib x-display-token) ──────────────────────
  {
    path: "/display/:slug",
    element: (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <DisplayProvider>
          <PublicDisplay />
        </DisplayProvider>
      </Suspense>
    ),
  },
  {
    path: "/display/:slug/santri/:id",
    element: (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <DisplayProvider>
          <SantriDetail />
        </DisplayProvider>
      </Suspense>
    ),
  },

  // ── Public: Portal Wali (2-step WhatsApp OTP) ───────────────────────────
  {
    path: "/portal",
    element: <PortalWaliPage />,
  },

  // ── Public: Landing & SEO Pages (tidak butuh login) ──────────────────────
  { path: "/", element: <LandingPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/features", element: <FeaturesPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/faq", element: <FaqPage /> },
  { path: "/blog", element: <BlogListPage /> },
  { path: "/blog/:slug", element: <BlogDetailPage /> },

  // Keyword Landings
  { path: "/aplikasi-halaqah", element: <LandingPage /> },
  { path: "/aplikasi-tahfidz", element: <LandingPage /> },
  { path: "/aplikasi-rumah-tahfidz", element: <LandingPage /> },
  { path: "/aplikasi-pondok-pesantren", element: <LandingPage /> },
  { path: "/aplikasi-tpq", element: <LandingPage /> },
  { path: "/aplikasi-setoran-hafalan", element: <LandingPage /> },
  { path: "/administrasi-tahfidz", element: <LandingPage /> },
  { path: "/monitoring-hafalan-santri", element: <LandingPage /> },
];
