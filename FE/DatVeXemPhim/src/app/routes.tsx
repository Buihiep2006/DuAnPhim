import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { HomePage } from "./components/pages/HomePage";
import { MovieDetailPage } from "./components/pages/MovieDetailPage";
import { SeatSelectionPage } from "./components/pages/SeatSelectionPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { UserProtectedRoute } from "./components/auth/UserProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminLogin } from "./components/admin/AdminLogin";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminMovies } from "./components/admin/AdminMovies";
import { AdminCinemas } from "./components/admin/AdminCinemas";
import { AdminSales } from "./components/admin/AdminSales";
import { AdminUsers } from "./components/admin/AdminUsers";
import { AdminSettings } from "./components/admin/AdminSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "movie/:id", Component: MovieDetailPage },
      { 
        path: "seat-selection/:showtimeId", 
        element: (
          <UserProtectedRoute>
            <SeatSelectionPage />
          </UserProtectedRoute>
        )
      },
      { 
        path: "checkout", 
        element: (
          <UserProtectedRoute>
            <CheckoutPage />
          </UserProtectedRoute>
        )
      },
      { 
        path: "profile", 
        element: (
          <UserProtectedRoute>
            <ProfilePage />
          </UserProtectedRoute>
        )
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: AdminDashboard },
      { path: "movies", Component: AdminMovies },
      { path: "cinemas", Component: AdminCinemas },
      { path: "sales", Component: AdminSales },
      { path: "users", Component: AdminUsers },
      { path: "settings", Component: AdminSettings },
    ],
  },
]);