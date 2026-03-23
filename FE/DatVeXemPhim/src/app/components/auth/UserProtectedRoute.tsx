import { Navigate, useLocation } from "react-router";
import { ReactNode } from "react";

interface UserProtectedRouteProps {
  children: ReactNode;
}

export function UserProtectedRoute({ children }: UserProtectedRouteProps) {
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();

  if (!userToken) {
    // Save the current location to redirect after login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
