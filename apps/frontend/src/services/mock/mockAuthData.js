import { ROLES } from "../../constants/roles.js";

// -----------------------------------------------------------------------
// DEMO / MOCK DATA ONLY.
// This file exists purely so the frontend has something realistic to run
// against before the Node/Express/PostgreSQL backend exists. None of this
// is real credential storage — swap auth.service.js to call the real API
// (see VITE_USE_MOCK_API in .env) and delete this file at that point.
// -----------------------------------------------------------------------

export const MOCK_TENANTS = [
  {
    id: "tenant-1",
    name: "Jubilee Hardware & Building Supplies",
    plan: "BUSINESS",
    status: "ACTIVE",
  },
  {
    id: "tenant-2",
    name: "Kisii Timber & Steel Ltd",
    plan: "PRO",
    status: "ACTIVE",
  },
];

export const MOCK_BRANCHES = [
  {
    id: "branch-1",
    tenantId: "tenant-1",
    name: "Nairobi Branch",
    code: "NRB-01",
    location: "Industrial Area, Nairobi",
    status: "ACTIVE",
  },
  {
    id: "branch-2",
    tenantId: "tenant-1",
    name: "Kisumu Branch",
    code: "KSM-01",
    location: "Kibuye, Kisumu",
    status: "ACTIVE",
  },
  {
    id: "branch-3",
    tenantId: "tenant-1",
    name: "Migori Branch",
    code: "MGR-01",
    location: "Migori Town",
    status: "ACTIVE",
  },
  {
    id: "branch-4",
    tenantId: "tenant-2",
    name: "Kisii Branch",
    code: "KSI-01",
    location: "Kisii Town",
    status: "ACTIVE",
  },
];

// Demo password for every mock account is: "password123"
// (checked in auth.service.js — never do this against a real backend).
export const MOCK_USERS = [
  {
    id: "user-super-1",
    name: "Asha Mwangi",
    email: "superadmin@hardwarepos.dev",
    role: ROLES.SUPER_ADMIN,
    tenantId: null,
    branchId: null,
  },
  {
    id: "user-admin-1",
    name: "Peter Otieno",
    email: "admin@jubileehardware.co.ke",
    role: ROLES.TENANT_ADMIN,
    tenantId: "tenant-1",
    branchId: null,
  },
  {
    id: "user-bm-1",
    name: "Grace Wambui",
    email: "manager.nairobi@jubileehardware.co.ke",
    role: ROLES.BRANCH_MANAGER,
    tenantId: "tenant-1",
    branchId: "branch-1",
  },
  {
    id: "user-cashier-1",
    name: "John Kamau",
    email: "cashier.nairobi@jubileehardware.co.ke",
    role: ROLES.CASHIER,
    tenantId: "tenant-1",
    branchId: "branch-1",
  },
  {
    id: "user-store-1",
    name: "Mary Achieng",
    email: "store.nairobi@jubileehardware.co.ke",
    role: ROLES.STOREKEEPER,
    tenantId: "tenant-1",
    branchId: "branch-1",
  },
  {
    id: "user-acct-1",
    name: "Daniel Kiptoo",
    email: "accountant@jubileehardware.co.ke",
    role: ROLES.ACCOUNTANT,
    tenantId: "tenant-1",
    branchId: null,
  },
  {
    id: "user-delivery-1",
    name: "Brian Omondi",
    email: "delivery.nairobi@jubileehardware.co.ke",
    role: ROLES.DELIVERY_OFFICER,
    tenantId: "tenant-1",
    branchId: "branch-1",
  },
];

export const MOCK_PASSWORD = "password123";
