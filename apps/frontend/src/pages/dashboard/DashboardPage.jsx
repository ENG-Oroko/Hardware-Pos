import { useAuth } from "../../hooks/useAuth.js";
import { useTenantContext } from "../../context/TenantContext.jsx";
import { useBranchContext } from "../../context/BranchContext.jsx";
import Card from "../../components/ui/Card.jsx";
import { ROLE_LABELS } from "../../constants/roles.js";

/**
 * Placeholder dashboard for this step of the build. It intentionally does
 * nothing fancy yet — its job is to prove that auth, RBAC, TenantContext
 * and BranchContext are wired correctly end-to-end before the real
 * role-specific dashboards (see project spec §18) are built next.
 */
export default function DashboardPage() {
  const { user, permissions } = useAuth();
  const { tenant, isPlatformLevel } = useTenantContext();
  const { currentBranch, availableBranches } = useBranchContext();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500">
          {ROLE_LABELS[user?.role] || user?.role}
          {tenant ? ` · ${tenant.name}` : ""}
          {currentBranch ? ` · ${currentBranch.name}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Session">
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Role</dt>
              <dd className="font-medium text-slate-800">{user?.role}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-800">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Scope</dt>
              <dd className="font-medium text-slate-800">
                {isPlatformLevel ? "Platform" : "Tenant"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Tenant">
          {isPlatformLevel ? (
            <p className="text-sm text-slate-500">
              Operating above tenant level (SUPER_ADMIN).
            </p>
          ) : (
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Business</dt>
                <dd className="font-medium text-slate-800">{tenant?.name || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Plan</dt>
                <dd className="font-medium text-slate-800">{tenant?.plan || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Branches</dt>
                <dd className="font-medium text-slate-800">{availableBranches.length}</dd>
              </div>
            </dl>
          )}
        </Card>

        <Card title="Permissions">
          <p className="mb-2 text-xs text-slate-500">
            {permissions.length} permission{permissions.length === 1 ? "" : "s"} granted to this role
          </p>
          <div className="flex max-h-32 flex-wrap gap-1 overflow-y-auto">
            {permissions.map((p) => (
              <span
                key={p}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-600"
              >
                {p}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card title="What's next">
        <p className="text-sm text-slate-600">
          Products, Inventory, POS, Customers, Suppliers, Purchasing, Payments,
          Credit, Deliveries, Expenses, Reports, Users, Subscription and
          Settings modules are built next, in that order, per the project
          roadmap. Each one will reuse this same Auth/Tenant/Branch context
          and the permission guards already wired up here.
        </p>
      </Card>
    </div>
  );
}
