// Business roles supported by the platform.
// Do not add new roles here without first documenting why an existing
// role + permission combination cannot express the requirement.

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  TENANT_ADMIN: "TENANT_ADMIN",
  BRANCH_MANAGER: "BRANCH_MANAGER",
  CASHIER: "CASHIER",
  STOREKEEPER: "STOREKEEPER",
  ACCOUNTANT: "ACCOUNTANT",
  DELIVERY_OFFICER: "DELIVERY_OFFICER",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.TENANT_ADMIN]: "Tenant Admin",
  [ROLES.BRANCH_MANAGER]: "Branch Manager",
  [ROLES.CASHIER]: "Cashier",
  [ROLES.STOREKEEPER]: "Storekeeper",
  [ROLES.ACCOUNTANT]: "Accountant",
  [ROLES.DELIVERY_OFFICER]: "Delivery Officer",
};

export const ALL_ROLES = Object.values(ROLES);
