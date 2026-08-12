import { TenantProvider } from "../context/TenantContext.jsx";
import { BranchProvider } from "../context/BranchContext.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";

/**
 * Route-level layout for every authenticated, tenant-scoped screen
 * (dashboard, POS, inventory, sales, etc.). Sits inside ProtectedRoute
 * in the router tree, so `useAuth()` is always guaranteed to have a user
 * by the time TenantProvider/BranchProvider read it.
 *
 * SUPER_ADMIN platform screens also render through here — TenantContext
 * simply reports `isPlatformLevel: true` / `tenant: null` for them.
 */
export default function DashboardLayout() {
  return (
    <TenantProvider>
      <BranchProvider>
        <MainLayout />
      </BranchProvider>
    </TenantProvider>
  );
}
