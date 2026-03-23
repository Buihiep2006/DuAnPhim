import { Navigate } from "react-router";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
