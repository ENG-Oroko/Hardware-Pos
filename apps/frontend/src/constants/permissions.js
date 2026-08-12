import { ROLES } from "./roles.js";

// Full permission catalogue for the platform.
// These drive UI visibility only. The backend must independently enforce
// every one of these checks — never treat this file as real security.
export const PERMISSIONS = {
  // Sales / POS
  SALES_CREATE: "sales.create",
  SALES_VIEW: "sales.view",
  SALES_RETURN: "sales.return",

  // Products
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",

  // Inventory
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_RECEIVE: "inventory.receive",
  INVENTORY_TRANSFER: "inventory.transfer",
  INVENTORY_ADJUST: "inventory.adjust",

  // Customers
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_UPDATE: "customers.update",

  // Suppliers
  SUPPLIERS_CREATE: "suppliers.create",
  SUPPLIERS_VIEW: "suppliers.view",
  SUPPLIERS_UPDATE: "suppliers.update",

  // Payments
  PAYMENTS_CREATE: "payments.create",
  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_RECONCILE: "payments.reconcile",

  // Expenses
  EXPENSES_CREATE: "expenses.create",
  EXPENSES_VIEW: "expenses.view",

  // Reports
  REPORTS_SALES: "reports.sales",
  REPORTS_INVENTORY: "reports.inventory",
  REPORTS_FINANCIAL: "reports.financial",

  // Users
  USERS_CREATE: "users.create",
  USERS_VIEW: "users.view",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",

  // Branches
  BRANCHES_CREATE: "branches.create",
  BRANCHES_VIEW: "branches.view",
  BRANCHES_UPDATE: "branches.update",

  // Deliveries
  DELIVERIES_VIEW: "deliveries.view",
  DELIVERIES_UPDATE: "deliveries.update",

  // Platform (SUPER_ADMIN only)
  PLATFORM_TENANTS_MANAGE: "platform.tenants.manage",
  PLATFORM_SUBSCRIPTIONS_MANAGE: "platform.subscriptions.manage",
  PLATFORM_SETTINGS_MANAGE: "platform.settings.manage",

  // Subscription (tenant-level)
  SUBSCRIPTION_VIEW: "subscription.view",
  SUBSCRIPTION_MANAGE: "subscription.manage",

  // Settings (tenant-level)
  SETTINGS_MANAGE: "settings.manage",
};

const P = PERMISSIONS;

// Role -> permission set. A role automatically has every permission listed
// here. SUPER_ADMIN and TENANT_ADMIN are intentionally broad because they
// each own their respective scope (platform vs. single business).
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    P.PLATFORM_TENANTS_MANAGE,
    P.PLATFORM_SUBSCRIPTIONS_MANAGE,
    P.PLATFORM_SETTINGS_MANAGE,
  ],

  [ROLES.TENANT_ADMIN]: [
    P.SALES_CREATE,
    P.SALES_VIEW,
    P.SALES_RETURN,
    P.PRODUCTS_CREATE,
    P.PRODUCTS_VIEW,
    P.PRODUCTS_UPDATE,
    P.PRODUCTS_DELETE,
    P.INVENTORY_VIEW,
    P.INVENTORY_RECEIVE,
    P.INVENTORY_TRANSFER,
    P.INVENTORY_ADJUST,
    P.CUSTOMERS_CREATE,
    P.CUSTOMERS_VIEW,
    P.CUSTOMERS_UPDATE,
    P.SUPPLIERS_CREATE,
    P.SUPPLIERS_VIEW,
    P.SUPPLIERS_UPDATE,
    P.PAYMENTS_CREATE,
    P.PAYMENTS_VIEW,
    P.PAYMENTS_RECONCILE,
    P.EXPENSES_CREATE,
    P.EXPENSES_VIEW,
    P.REPORTS_SALES,
    P.REPORTS_INVENTORY,
    P.REPORTS_FINANCIAL,
    P.USERS_CREATE,
    P.USERS_VIEW,
    P.USERS_UPDATE,
    P.USERS_DELETE,
    P.BRANCHES_CREATE,
    P.BRANCHES_VIEW,
    P.BRANCHES_UPDATE,
    P.DELIVERIES_VIEW,
    P.DELIVERIES_UPDATE,
    P.SUBSCRIPTION_VIEW,
    P.SUBSCRIPTION_MANAGE,
    P.SETTINGS_MANAGE,
  ],

  [ROLES.BRANCH_MANAGER]: [
    P.SALES_VIEW,
    P.SALES_RETURN,
    P.PRODUCTS_VIEW,
    P.INVENTORY_VIEW,
    P.INVENTORY_TRANSFER,
    P.INVENTORY_ADJUST,
    P.CUSTOMERS_CREATE,
    P.CUSTOMERS_VIEW,
    P.CUSTOMERS_UPDATE,
    P.USERS_VIEW,
    P.BRANCHES_VIEW,
    P.DELIVERIES_VIEW,
    P.REPORTS_SALES,
    P.REPORTS_INVENTORY,
  ],

  [ROLES.CASHIER]: [
    P.SALES_CREATE,
    P.SALES_VIEW,
    P.SALES_RETURN,
    P.PRODUCTS_VIEW,
    P.CUSTOMERS_CREATE,
    P.CUSTOMERS_VIEW,
    P.PAYMENTS_CREATE,
  ],

  [ROLES.STOREKEEPER]: [
    P.PRODUCTS_VIEW,
    P.INVENTORY_VIEW,
    P.INVENTORY_RECEIVE,
    P.INVENTORY_TRANSFER,
    P.INVENTORY_ADJUST,
    P.SUPPLIERS_VIEW,
  ],

  [ROLES.ACCOUNTANT]: [
    P.SALES_VIEW,
    P.PAYMENTS_VIEW,
    P.PAYMENTS_RECONCILE,
    P.EXPENSES_CREATE,
    P.EXPENSES_VIEW,
    P.CUSTOMERS_VIEW,
    P.SUPPLIERS_VIEW,
    P.REPORTS_SALES,
    P.REPORTS_INVENTORY,
    P.REPORTS_FINANCIAL,
  ],

  [ROLES.DELIVERY_OFFICER]: [
    P.DELIVERIES_VIEW,
    P.DELIVERIES_UPDATE,
    P.CUSTOMERS_VIEW,
  ],
};

/**
 * Returns the flat list of permission keys granted to a role.
 * @param {string} role
 * @returns {string[]}
 */
export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}
