import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import authService from "../services/auth.service.js";
import { registerSessionExpiredHandler } from "../services/api.js";
import { saveSession, loadSession, clearSession } from "../utils/storage.js";
import { ROLES } from "../constants/roles.js";

const AuthContext = createContext(null);

/**
 * Owns the authentication lifecycle: login, logout, session restore on
 * page load, and exposes the current user + tenant/branch snapshot that
 * came back with the session. TenantContext and BranchContext build on
 * top of this rather than duplicating session logic.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [branch, setBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const applySession = useCallback((session) => {
    setUser(session.user);
    setTenant(session.tenant);
    setBranch(session.branch);
    saveSession({ token: session.token, userId: session.user.id });
  }, []);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setTenant(null);
    setBranch(null);
    clearSession();
  }, []);

  // Restore session on first load (e.g. page refresh) by re-validating
  // the stored session against the backend/mock service.
  useEffect(() => {
    const stored = loadSession();
    if (!stored?.userId) {
      setIsLoading(false);
      return;
    }

    authService
      .getCurrentUser(stored.userId)
      .then((session) => applySession(session))
      .catch(() => clearAuthState())
      .finally(() => setIsLoading(false));
  }, [applySession, clearAuthState]);

  // If any API call comes back 401, api.js calls this to force logout.
  useEffect(() => {
    registerSessionExpiredHandler(() => {
      clearAuthState();
      setAuthError("Your session has expired. Please sign in again.");
    });
  }, [clearAuthState]);

  const login = useCallback(
    async (email, password) => {
      setAuthError(null);
      try {
        const session = await authService.login(email, password);
        applySession(session);
        return session;
      } catch (err) {
        setAuthError(err?.message || "Unable to sign in");
        throw err;
      }
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  const permissions = useMemo(() => user?.permissions || [], [user]);

  const hasPermission = useCallback(
    (permission) => permissions.includes(permission),
    [permissions]
  );

  const hasRole = useCallback(
    (...roles) => (user ? roles.includes(user.role) : false),
    [user]
  );

  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  const value = useMemo(
    () => ({
      user,
      tenant,
      branch,
      isAuthenticated: Boolean(user),
      isLoading,
      authError,
      isSuperAdmin,
      permissions,
      hasPermission,
      hasRole,
      login,
      logout,
    }),
    [
      user,
      tenant,
      branch,
      isLoading,
      authError,
      isSuperAdmin,
      permissions,
      hasPermission,
      hasRole,
      login,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}

export default AuthContext;
