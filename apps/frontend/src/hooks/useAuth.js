import { useAuthContext } from "../context/AuthContext.jsx";

/**
 * Preferred way to access auth state/actions from components and pages.
 * Kept as a thin wrapper so `../context/AuthContext.jsx` internals can
 * change without every consumer needing to update its import path.
 */
export function useAuth() {
  return useAuthContext();
}

export default useAuth;
