import { createContext, useContext, useMemo } from "react";
import { useAuth } from "../hooks/useAuth.js";

const TenantContext = createContext(null);

/**
 * Exposes the business ("tenant") the current user belongs to.
 * The tenant comes back as part of the auth session (see auth.service.js),
 * so this provider mostly re-shapes that data for tenant-scoped screens
 * (branches, subscription, settings, etc.) without them needing to reach
 * into AuthContext directly.
 *
 * SUPER_ADMIN has no tenant — they operate above tenant level — so
 * `tenant` will be null for that role, and `isPlatformLevel` will be true.
 */
export function TenantProvider({ children }) {
  const { tenant, user, isSuperAdmin } = useAuth();

  const value = useMemo(
    () => ({
      tenant,
      tenantId: tenant?.id ?? null,
      plan: tenant?.plan ?? null,
      isPlatformLevel: isSuperAdmin,
      // Convenience guard for screens that must never render without a
      // tenant in scope (everything except platform-level SUPER_ADMIN screens).
      hasTenant: Boolean(tenant) && !isSuperAdmin,
      userId: user?.id ?? null,
    }),
    [tenant, isSuperAdmin, user]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenantContext() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenantContext must be used within a TenantProvider");
  }
  return ctx;
}

export default TenantContext;
