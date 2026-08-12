import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";

/**
 * Gate for any route that requires a logged-in user. Renders the nested
 * route (via <Outlet />) once authenticated; otherwise redirects to
 * /login and remembers where the user was headed so we can return them
 * there after a successful login.
 *
 * This is a UX/navigation convenience only — it does not substitute for
 * backend authorization on the actual API calls those routes make.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Restoring your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
