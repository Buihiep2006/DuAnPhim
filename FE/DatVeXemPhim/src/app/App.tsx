import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap-custom.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import MovieDetailPage from './pages/customer/MovieDetailPage';
import SeatSelectionPage from './pages/customer/SeatSelectionPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import ProfilePage from './pages/customer/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminCategories from './pages/admin/AdminCategories';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import AdminCinemas from './pages/admin/AdminCinemas';
import AdminRooms from './pages/admin/AdminRooms';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminServices from './pages/admin/AdminServices';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Protected Routes
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthContextProvider>
      <BookingProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Customer Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies/:id" element={<MovieDetailPage />} />
              <Route path="/seat-selection/:showtimeId" element={<SeatSelectionPage />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="movies" element={<AdminMovies />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="showtimes" element={<AdminShowtimes />} />
              <Route path="cinemas" element={<AdminCinemas />} />
              <Route path="cinemas/:cinemaId/rooms" element={<AdminRooms />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </AuthContextProvider>
  );
}