import { Outlet } from "react-router-dom";
import { Wrench, Boxes, Wallet, BarChart3, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Boxes,
    title: "Units that make sense",
    text: "Bags, metres, tonnes, rolls and pieces — not just \"item\".",
  },
  {
    icon: Wallet,
    title: "Every payment, one sale",
    text: "Cash, M-Pesa, Bank, Card and Credit, even split across a sale.",
  },
  {
    icon: BarChart3,
    title: "One view, every branch",
    text: "Sales, stock and profit across Nairobi, Kisumu, Migori and beyond.",
  },
  {
    icon: ShieldCheck,
    title: "Roles that fit your team",
    text: "Cashiers, storekeepers and admins each see only what they need.",
  },
];

/**
 * Decorative dot-grid + soft blob background for the marketing panel.
 * Purely CSS/SVG — no external image assets to keep the bundle self
 * contained and avoid depending on network access for a stock photo.
 */
function PanelBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-green-950">
      <svg className="absolute inset-0 h-full w-full opacity-[0.15]" aria-hidden="true">
        <defs>
          <pattern id="auth-dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-dot-grid)" />
      </svg>
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-400 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-green-300 opacity-15 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-white opacity-5 blur-3xl" />
    </div>
  );
}

/**
 * Layout for unauthenticated screens (login, forgot/verify/reset
 * password). Marketing panel is on the LEFT; the actual form is on the
 * RIGHT. The marketing panel is hidden below the `lg` breakpoint so
 * mobile users just get the full-width form.
 *
 * Neither column mounts Sidebar/Topbar/context providers — those all
 * assume a logged-in user.
 */
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Marketing / content column */}
      <div className="relative hidden w-[55%] lg:flex">
        <PanelBackground />

        <div className="relative z-10 flex w-full flex-col justify-center px-14 py-16 text-white xl:px-20">
          <span className="mb-5 inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-green-100 ring-1 ring-inset ring-white/20">
            SaaS for Hardware &amp; Building Materials
          </span>

          <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            Run every branch, every sale, every credit account — from one system.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-green-100/90">
            Point of sale, inventory and reporting designed around how
            hardware shops actually work — cement in bags, steel in metres,
            and customers who buy on credit.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-green-100/80">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form column */}
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-[45%] lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-green-200">
              <Wrench className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-bold leading-tight text-slate-900">Hardware POS</p>
              <p className="text-xs leading-tight text-slate-500">Built for hardware &amp; building-material businesses</p>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
