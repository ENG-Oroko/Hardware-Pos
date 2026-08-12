import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User as UserIcon, Building2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useTenantContext } from "../../context/TenantContext.jsx";
import { useBranchContext } from "../../context/BranchContext.jsx";
import { ROLE_LABELS } from "../../constants/roles.js";

function useClickOutside(onClose) {
  const ref = useRef(null);
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);
  return ref;
}

function BranchSwitcher() {
  const { currentBranch, availableBranches, canSwitchBranch, switchBranch } =
    useBranchContext();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  if (!currentBranch && availableBranches.length === 0) return null;

  if (!canSwitchBranch) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
        <Building2 className="h-4 w-4" />
        {currentBranch?.name || "No branch assigned"}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm
          text-slate-700 hover:bg-slate-50"
      >
        <Building2 className="h-4 w-4 text-slate-500" />
        {currentBranch?.name || "Select branch"}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-56 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {availableBranches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                switchBranch(b.id);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                b.id === currentBranch?.id ? "font-semibold text-brand-700" : "text-slate-700"
              }`}
            >
              {b.name}
              <span className="ml-1 text-xs text-slate-400">({b.code})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium text-slate-800">{user?.name}</span>
          <span className="block text-xs text-slate-500">
            {ROLE_LABELS[user?.role] || user?.role}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-sm text-slate-600">
            <UserIcon className="h-4 w-4" />
            {user?.email}
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Top bar shown above the main content area on every authenticated page.
 * Hosts branch switching (for roles allowed to switch) and the user menu.
 */
export default function Topbar() {
  const { tenant } = useTenantContext();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-sm font-semibold text-slate-800">{tenant?.name || "Hardware POS"}</p>
        {tenant?.plan && <p className="text-xs text-slate-400">{tenant.plan} plan</p>}
      </div>
      <div className="flex items-center gap-3">
        <BranchSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}
