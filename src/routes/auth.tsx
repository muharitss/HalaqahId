import { type RouteObject } from "react-router-dom";
import { LoginPage, RegisterPage, VerifyEmailPage } from "@/features/auth";
import { GuestRoute } from "./guards";

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
];
