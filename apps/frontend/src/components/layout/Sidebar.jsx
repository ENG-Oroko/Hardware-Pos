import { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { ChevronDown, Wrench } from "lucide-react";
import { NAVIGATION, PLATFORM_NAVIGATION } from "../../constants/navigation.js";
import { usePermission } from "../../hooks/usePermission.js";
import { useAuth } from "../../hooks/useAuth.js";

function resolveIcon(name) {
  const IconComponent = Icons[name];
  return IconComponent || Wrench;
}

function NavGroup({ item }) {
  const [open, setOpen] = useState(true);
  const Icon = resolveIcon(item.icon);

  const visibleChildren = item.children || [];
  if (visibleChildren.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium
          text-slate-600 transition-colors hover:bg-green-50 hover:text-brand-700"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {item.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-slate-200 pl-3">
          {visibleChildren.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-green-50 font-semibold text-brand-700"
                    : "text-slate-500 hover:bg-green-50 hover:text-brand-700"
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function NavLeaf({ item }) {
  const Icon = resolveIcon(item.icon);
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "border-brand-600 bg-green-50 text-brand-700"
            : "border-transparent text-slate-600 hover:bg-green-50 hover:text-brand-700"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  );
}

/**
 * Main app sidebar. Filters NAVIGATION (see src/constants/navigation.js)
 * down to whatever the current user's permissions allow, so the menu a
 * cashier sees never even lists screens they can't use.
 *
 * SUPER_ADMIN gets a separate, platform-level navigation set since they
 * operate above the tenant/branch layer entirely.
 */
export default function Sidebar() {
  const { hasPermission } = usePermission();
  const { isSuperAdmin } = useAuth();

  const items = isSuperAdmin ? PLATFORM_NAVIGATION : NAVIGATION;

  const visibleItems = items.filter(
    (item) => item.permission === null || hasPermission(item.permission)
  );

  return (
    <nav className="flex h-full w-64 flex-col border-r border-slate-200 bg-white text-slate-700">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Wrench className="h-4 w-4" />
        </span>
        <span className="text-lg font-bold tracking-tight text-slate-900">Hardware POS</span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {visibleItems.map((item) =>
          item.children ? (
            <NavGroup key={item.label} item={item} />
          ) : (
            <NavLeaf key={item.path} item={item} />
          )
        )}
      </div>
    </nav>
  );
}
