import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission.js";

/**
 * Same two usage patterns as RoleGuard, but checks fine-grained
 * permissions (see src/constants/permissions.js) instead of roles.
 * Prefer this over RoleGuard for feature-level checks (e.g. "can this
 * user delete a product") since permissions survive future role changes
 * better than hard-coded role lists.
 *
 * <PermissionGuard permissions={[PERMISSIONS.PRODUCTS_DELETE]}>
 *   <DeleteProductButton />
 * </PermissionGuard>
 *
 * By default ANY of the listed permissions is enough; pass `requireAll`
 * to require every one of them.
 */
export default function PermissionGuard({
  permissions = [],
  requireAll = false,
  inline = false,
  redirectTo = "/unauthorized",
  children,
}) {
  const { hasAllPermissions, hasAnyPermission } = usePermission();

  const allowed = requireAll
    ? hasAllPermissions(...permissions)
    : hasAnyPermission(...permissions);

  if (inline) {
    return allowed ? children : null;
  }

  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ?? <Outlet />;
}
