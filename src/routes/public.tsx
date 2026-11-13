/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { Outlet, Navigate, type RouteObject } from "react-router-dom";
import { PortalProvider } from "@/features/portal/store/portal-context";
import { DisplayProvider } from "@/features/display";

const PortalLoginPage = lazy(() => import("@/features/portal/pages/PortalLoginPage"));
const PortalDashboard = lazy(() => import("@/features/portal/pages/PortalDashboard"));
const PublicDisplay = lazy(() => import("@/features/display/pages/PublicDisplay"));
const SantriDetail = lazy(() => import("@/features/display/pages/SantriDetail"));

// Public Marketing & SEO Pages
const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const AboutPage = lazy(() => import("@/features/landing/pages/AboutPage"));
const FeaturesPage = lazy(() => import("@/features/landing/pages/FeaturesPage"));
const ContactPage = lazy(() => import("@/features/landing/pages/ContactPage"));
const FaqPage = lazy(() => import("@/features/landing/pages/FaqPage"));
const BlogListPage = lazy(() => import("@/features/blog/pages/BlogListPage"));
const BlogDetailPage = lazy(() => import("@/features/blog/pages/BlogDetailPage"));

// Portal wrapper with isolated parent auth context
const PortalWrapper = () => (
  <PortalProvider>
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  </PortalProvider>
);

const PublicSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const publicRoutes: RouteObject[] = [
  // ── Public: Portal Orang Tua (tanpa DashboardLayout) ─────────────────────
  {
    path: "/:slug/portal",
    element: <PortalWrapper />,
    children: [
      {
        index: true,
        element: <PortalLoginPage />,
      },
      {
        path: "dashboard",
        element: <PortalDashboard />,
      },
    ],
  },

  // ── Public: Display Portal (tidak butuh login) ───────────────────────────
  {
    path: "/display",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/display/:slug",
    element: (
      <DisplayProvider>
        <Suspense
          fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          }
        >
          <PublicDisplay />
        </Suspense>
      </DisplayProvider>
    ),
  },
  {
    path: "/display/:slug/santri/:id",
    element: (
      <DisplayProvider>
        <Suspense
          fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          }
        >
          <SantriDetail />
        </Suspense>
      </DisplayProvider>
    ),
  },

  // ── Public: Landing & SEO Pages (tidak butuh login) ──────────────────────
  {
    path: "/",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/about",
    element: (
      <PublicSuspense>
        <AboutPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/features",
    element: (
      <PublicSuspense>
        <FeaturesPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <PublicSuspense>
        <ContactPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/faq",
    element: (
      <PublicSuspense>
        <FaqPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/blog",
    element: (
      <PublicSuspense>
        <BlogListPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/blog/:slug",
    element: (
      <PublicSuspense>
        <BlogDetailPage />
      </PublicSuspense>
    ),
  },

  // Keyword Landings
  {
    path: "/aplikasi-halaqah",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/aplikasi-tahfidz",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/aplikasi-rumah-tahfidz",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/aplikasi-pondok-pesantren",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/aplikasi-tpq",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/aplikasi-setoran-hafalan",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/administrasi-tahfidz",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
  {
    path: "/monitoring-hafalan-santri",
    element: (
      <PublicSuspense>
        <LandingPage />
      </PublicSuspense>
    ),
  },
];
