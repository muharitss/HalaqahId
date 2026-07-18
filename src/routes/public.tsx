import { type RouteObject } from "react-router-dom";
import {
  LandingPage,
  AboutPage,
  FeaturesPage,
  ContactPage,
  FaqPage,
} from "@/features/landing";
import { BlogListPage, BlogDetailPage } from "@/features/blog";
import {
  DisplayProvider,
  PublicDisplay,
  SantriDetail,
} from "@/features/display";

export const publicRoutes: RouteObject[] = [
  // ── Public: Display Portal (tidak butuh login) ───────────────────────────
  {
    path: "/display/:slug",
    element: (
      <DisplayProvider>
        <PublicDisplay />
      </DisplayProvider>
    ),
  },
  {
    path: "/display/:slug/santri/:id",
    element: (
      <DisplayProvider>
        <SantriDetail />
      </DisplayProvider>
    ),
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
