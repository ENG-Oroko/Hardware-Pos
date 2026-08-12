import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useTenantContext } from "./TenantContext.jsx";
import branchesService from "../services/branches.service.js";
import { ROLES } from "../constants/roles.js";

const BranchContext = createContext(null);

// Roles whose work is scoped to exactly one branch and who should never
// be offered a branch switcher in the UI.
const SINGLE_BRANCH_ROLES = [
  ROLES.CASHIER,
  ROLES.STOREKEEPER,
  ROLES.DELIVERY_OFFICER,
];

/**
 * Provides the "current branch" for branch-scoped screens (inventory,
 * POS, branch reports, etc.) plus the list of branches the user is
 * allowed to switch between.
 *
 * - CASHIER / STOREKEEPER / DELIVERY_OFFICER are pinned to their assigned
 *   branch (set at login) and cannot switch.
 * - TENANT_ADMIN / ACCOUNTANT can view across branches and switch freely.
 * - BRANCH_MANAGER is pinned to their managed branch for now (multi-branch
 *   managers are out of scope until the backend models that relationship).
 *
 * Branch isolation is mandatory: every inventory/sales/report call in
 * later modules must read `currentBranchId` from here rather than letting
 * a screen invent its own branch state.
 */
export function BranchProvider({ children }) {
  const { user, branch: sessionBranch } = useAuth();
  const { tenantId, isPlatformLevel } = useTenantContext();

  const [availableBranches, setAvailableBranches] = useState([]);
  const [currentBranchId, setCurrentBranchId] = useState(
    sessionBranch?.id ?? null
  );
  const [isLoading, setIsLoading] = useState(false);

  const canSwitchBranch = useMemo(() => {
    if (!user) return false;
    return !SINGLE_BRANCH_ROLES.includes(user.role);
  }, [user]);

  useEffect(() => {
    if (!tenantId || isPlatformLevel) {
      setAvailableBranches([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    branchesService
      .listForTenant(tenantId)
      .then((branches) => {
        if (cancelled) return;
        setAvailableBranches(branches);

        // Pick a sensible default current branch:
        // 1) the branch fixed on the user's session, if any
        // 2) otherwise the first available branch (for tenant-wide roles)
        if (!currentBranchId) {
          setCurrentBranchId(sessionBranch?.id ?? branches[0]?.id ?? null);
        }
      })
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, isPlatformLevel]);

  const switchBranch = useCallback(
    (branchId) => {
      if (!canSwitchBranch) return;
      setCurrentBranchId(branchId);
    },
    [canSwitchBranch]
  );

  const currentBranch = useMemo(
    () => availableBranches.find((b) => b.id === currentBranchId) || sessionBranch || null,
    [availableBranches, currentBranchId, sessionBranch]
  );

  const value = useMemo(
    () => ({
      currentBranch,
      currentBranchId: currentBranch?.id ?? null,
      availableBranches,
      canSwitchBranch,
      switchBranch,
      isLoading,
    }),
    [currentBranch, availableBranches, canSwitchBranch, switchBranch, isLoading]
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranchContext() {
  const ctx = useContext(BranchContext);
  if (!ctx) {
    throw new Error("useBranchContext must be used within a BranchProvider");
  }
  return ctx;
}

export default BranchContext;
