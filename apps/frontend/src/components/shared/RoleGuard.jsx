import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Two ways to use this component:
 *
 * 1. As a route guard (renders <Outlet /> for nested routes):
 *    <Route element={<RoleGuard roles={[ROLES.SUPER_ADMIN]} />}>
 *      <Route path="/platform/tenants" element={<TenantsPage />} />
 *    </Route>
 *
 * 2. As an inline wrapper around a UI section:
 *    <RoleGuard roles={[ROLES.TENANT_ADMIN]} inline>
 *      <DangerZoneCard />
 *    </RoleGuard>
 *
 * Remember: this only hides things in the UI. The backend must reject
 * any request from a role that shouldn't be able to perform it.
 */
export default function RoleGuard({ roles = [], inline = false, redirectTo = "/unauthorized", children }) {
  const { hasRole } = useAuth();
  const allowed = hasRole(...roles);

  if (inline) {
    return allowed ? children : null;
  }

  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ?? <Outlet />;
}
