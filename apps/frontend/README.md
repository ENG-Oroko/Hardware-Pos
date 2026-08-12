# Hardware POS — Frontend

A multi-tenant SaaS POS frontend for hardware and building-material
businesses. React + Vite + JavaScript (no TypeScript), Tailwind CSS,
React Router, Axios.

This delivery covers step 1–7 of the project roadmap:
**Project setup → Architecture → Authentication → Layout → RBAC →
Tenant context → Branch context**, plus a minimal role-aware dashboard
placeholder that proves the whole stack is wired together correctly.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

Styling uses **Tailwind CSS v4** via the `@tailwindcss/vite` plugin —
there's no `tailwind.config.js` or `postcss.config.js` in this project.
Theme tokens (colors, fonts) live in `src/index.css` under an `@theme`
block instead.

> This environment has no backend yet. `VITE_USE_MOCK_API=true` (the
> default in `.env.example`) routes every service call through an
> in-memory mock instead of a real API. Flip it to `false` once the
> Node/Express/PostgreSQL backend exists — no component code needs to
> change, only `src/services/*.service.js` internals.

## Demo logins

Password for every account below: `password123`

| Role | Email |
|---|---|
| SUPER_ADMIN | superadmin@hardwarepos.dev |
| TENANT_ADMIN | admin@jubileehardware.co.ke |
| BRANCH_MANAGER | manager.nairobi@jubileehardware.co.ke |
| CASHIER | cashier.nairobi@jubileehardware.co.ke |
| STOREKEEPER | store.nairobi@jubileehardware.co.ke |
| ACCOUNTANT | accountant@jubileehardware.co.ke |
| DELIVERY_OFFICER | delivery.nairobi@jubileehardware.co.ke |

The login page also lists these and will fill the form for you on click.

## Password reset flow

`/login` → **Forgot password?** → `/forgot-password` (enter email) →
`/verify-otp` (enter the 6-digit code) → `/reset-password` (set a new
password) → back to `/login`.

In mock mode (the default), no real email/SMS is sent — the OTP is shown
directly on the "Enter the code" screen in a "Demo mode" banner so you
can test the whole flow without a backend. Resetting the password in
mock mode does **not** actually change the demo account's password;
keep signing in with `password123`. Once the real backend exists, wire
`POST /auth/forgot-password`, `POST /auth/verify-otp`, and
`POST /auth/reset-password` — the request/response shapes are already
defined in `src/services/auth.service.js`.

## Theme

Light green and white, driven by the `brand` color scale defined in
`src/index.css` via Tailwind v4's `@theme` block (there is no
`tailwind.config.js` in this project — v4 doesn't need one). Buttons,
links, focus rings, the active sidebar item, and the auth screens all
pull from this one palette — to re-theme later, change the hex values
in `src/index.css` rather than hunting for `green-*` classes across
components.

## What's wired up in this step

- **Auth** (`src/context/AuthContext.jsx`, `src/services/auth.service.js`):
  login, logout, session restore on page refresh (via `sessionStorage`,
  token only — never a password), automatic logout on a `401` from any
  API call (`src/services/api.js`).
- **RBAC**: 7 fixed roles (`src/constants/roles.js`) mapped to a granular
  permission catalogue (`src/constants/permissions.js`). `usePermission()`
  and the `<RoleGuard />` / `<PermissionGuard />` components
  (`src/components/shared/`) gate both routes and inline UI. Remember:
  **this is UX only** — the real Express/PostgreSQL backend must enforce
  every one of these checks independently.
- **Tenant context** (`src/context/TenantContext.jsx`): exposes the
  business the logged-in user belongs to. `SUPER_ADMIN` has no tenant —
  `isPlatformLevel` is `true` for them instead.
- **Branch context** (`src/context/BranchContext.jsx`): exposes the
  "current branch" for branch-scoped screens, plus a switcher for roles
  allowed to move between branches (`TENANT_ADMIN`, `ACCOUNTANT`).
  `CASHIER` / `STOREKEEPER` / `DELIVERY_OFFICER` are pinned to their
  assigned branch and never see a switcher.
- **Layout**: `Sidebar` (permission-filtered navigation, see
  `src/constants/navigation.js`), `Topbar` (branch switcher + user menu),
  `MainLayout`/`DashboardLayout`/`AuthLayout`.
- **Routing** (`src/routes/AppRoutes.jsx`): `/login` (public-only),
  `/dashboard` (protected), `/unauthorized`, `*` → 404.

## Known, intentional gaps at this step

- Sidebar links to Products, Inventory, POS, Sales, etc. are already
  permission-filtered and will render correctly, but their target pages
  don't exist yet — clicking them currently falls through to the 404
  page. This is expected; those modules are next per the roadmap
  (`docs/roadmap` in the project instructions).
- All data is mock/in-memory. No PostgreSQL, no Express — the service
  layer is deliberately structured so wiring in the real backend later
  is a one-file change per domain, not a rewrite.

## Coding conventions (see project instructions for full rules)

- JavaScript only — never `.ts`/`.tsx`.
- ES Modules only — never `require()`/`module.exports`.
- Relative imports only — never `@/...` aliases.
- npm only.
