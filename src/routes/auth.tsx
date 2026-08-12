import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";
import { GuestRoute, LoadingScreen } from "./guards";

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const VerifyEmailPage = lazy(() =>
  import("@/features/auth/pages/VerifyEmailPage").then((m) => ({ default: m.VerifyEmailPage }))
);

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Suspense fallback={<LoadingScreen />}>
          <LoginPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Suspense fallback={<LoadingScreen />}>
          <RegisterPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <VerifyEmailPage />
      </Suspense>
    ),
  },
];
