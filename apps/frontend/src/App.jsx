import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

/**
 * AuthProvider sits above the router because both PublicOnlyRoute and
 * ProtectedRoute (inside AppRoutes) need auth state to decide where to
 * send the user. TenantProvider/BranchProvider are deliberately NOT here
 * — they live inside DashboardLayout since they depend on an
 * authenticated user already being present.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
