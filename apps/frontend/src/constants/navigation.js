import { PERMISSIONS } from "./permissions.js";

// Declarative sidebar navigation. The Sidebar component filters this list
// against the current user's permissions, so navigation always matches
// what the user is actually allowed to do (UI convenience only — the
// backend remains the real authorization boundary).
//
// `permission: null` means "visible to any authenticated user".
export const NAVIGATION = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    permission: null,
  },
  {
    label: "POS",
    path: "/pos",
    icon: "ShoppingCart",
    permission: PERMISSIONS.SALES_CREATE,
  },
  {
    label: "Sales",
    icon: "Receipt",
    permission: PERMISSIONS.SALES_VIEW,
    children: [
      { label: "Sales", path: "/sales" },
      { label: "Quotations", path: "/sales/quotations" },
      { label: "Invoices", path: "/sales/invoices" },
      { label: "Returns", path: "/sales/returns" },
    ],
  },
  {
    label: "Inventory",
    icon: "Boxes",
    permission: PERMISSIONS.INVENTORY_VIEW,
    children: [
      { label: "Products", path: "/inventory/products" },
      { label: "Stock", path: "/inventory/stock" },
      { label: "Stock Movements", path: "/inventory/movements" },
      { label: "Transfers", path: "/inventory/transfers" },
      { label: "Stock Adjustments", path: "/inventory/adjustments" },
    ],
  },
  {
    label: "Purchasing",
    icon: "Truck",
    permission: PERMISSIONS.SUPPLIERS_VIEW,
    children: [
      { label: "Suppliers", path: "/purchasing/suppliers" },
      { label: "Purchase Orders", path: "/purchasing/orders" },
      { label: "Goods Received", path: "/purchasing/goods-received" },
      { label: "Supplier Payments", path: "/purchasing/payments" },
    ],
  },
  {
    label: "Customers",
    icon: "Users",
    permission: PERMISSIONS.CUSTOMERS_VIEW,
    children: [
      { label: "Customers", path: "/customers" },
      { label: "Credit", path: "/customers/credit" },
      { label: "Payments", path: "/customers/payments" },
    ],
  },
  {
    label: "Deliveries",
    path: "/deliveries",
    icon: "Truck",
    permission: PERMISSIONS.DELIVERIES_VIEW,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: "Wallet",
    permission: PERMISSIONS.EXPENSES_VIEW,
  },
  {
    label: "Reports",
    icon: "BarChart3",
    permission: PERMISSIONS.REPORTS_SALES,
    children: [
      { label: "Sales Reports", path: "/reports/sales" },
      { label: "Inventory Reports", path: "/reports/inventory" },
      { label: "Financial Reports", path: "/reports/financial" },
    ],
  },
  {
    label: "Users & Roles",
    path: "/users",
    icon: "ShieldCheck",
    permission: PERMISSIONS.USERS_VIEW,
  },
  {
    label: "Branches",
    path: "/branches",
    icon: "Building2",
    permission: PERMISSIONS.BRANCHES_VIEW,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: "Settings",
    permission: PERMISSIONS.SETTINGS_MANAGE,
  },
  {
    label: "Subscription",
    path: "/subscription",
    icon: "CreditCard",
    permission: PERMISSIONS.SUBSCRIPTION_VIEW,
  },
];

// Separate, minimal nav for SUPER_ADMIN platform-level screens.
export const PLATFORM_NAVIGATION = [
  {
    label: "Platform Dashboard",
    path: "/platform/dashboard",
    icon: "LayoutDashboard",
    permission: null,
  },
  {
    label: "Tenants",
    path: "/platform/tenants",
    icon: "Building2",
    permission: PERMISSIONS.PLATFORM_TENANTS_MANAGE,
  },
  {
    label: "Subscriptions",
    path: "/platform/subscriptions",
    icon: "CreditCard",
    permission: PERMISSIONS.PLATFORM_SUBSCRIPTIONS_MANAGE,
  },
  {
    label: "Platform Settings",
    path: "/platform/settings",
    icon: "Settings",
    permission: PERMISSIONS.PLATFORM_SETTINGS_MANAGE,
  },
];
