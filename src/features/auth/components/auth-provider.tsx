import React from "react";
export { useAuth } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
export default AuthProvider;
