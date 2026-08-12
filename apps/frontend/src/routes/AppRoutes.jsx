import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "../components/shared/ProtectedRoute.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import UnauthorizedPage from "../pages/UnauthorizedPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

/**
 * Sends an already-authenticated user straight to the dashboard instead
 * of letting them sit on /login again.
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

/**
 * Central route tree.
 *
 * NOTE for the next build steps: only /dashboard exists as a real page so
 * far. Sidebar links for Products, Inventory, POS, etc. are already
 * permission-filtered and will render correctly once those pages are
 * added in their own steps — until then they intentionally fall through
 * to NotFoundPage, which is expected at this stage of the build.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicOnlyRoute>
              <VerifyOtpPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPasswordPage />
            </PublicOnlyRoute>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
