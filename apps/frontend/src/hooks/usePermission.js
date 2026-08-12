import { useAuth } from "./useAuth.js";

/**
 * Convenience hook for permission/role checks inside components.
 * This is a UX affordance only (hiding/disabling controls) — the backend
 * remains the authoritative enforcement point for every one of these.
 */
export function usePermission() {
  const { hasPermission, hasRole, permissions, user } = useAuth();

  return {
    hasPermission,
    hasRole,
    permissions,
    /** True if the user has EVERY permission passed in. */
    hasAllPermissions: (...perms) => perms.every((p) => hasPermission(p)),
    /** True if the user has AT LEAST ONE of the permissions passed in. */
    hasAnyPermission: (...perms) => perms.some((p) => hasPermission(p)),
    role: user?.role || null,
  };
}

export default usePermission;
