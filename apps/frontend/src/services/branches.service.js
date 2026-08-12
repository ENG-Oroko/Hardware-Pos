import api from "./api.js";
import { env } from "../config/env.js";
import { MOCK_BRANCHES } from "./mock/mockAuthData.js";

// NOTE: This service currently only exposes what BranchContext needs
// (listing a tenant's branches so the user can switch context). Full
// branch CRUD (create/update/deactivate) is added in the Branches module
// step, per the project roadmap — this file will grow, not be replaced.

function simulateNetworkDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockListBranchesForTenant(tenantId) {
  await simulateNetworkDelay();
  return MOCK_BRANCHES.filter((b) => b.tenantId === tenantId);
}

export const branchesService = {
  /**
   * @param {string} tenantId
   * @returns {Promise<Array>}
   */
  async listForTenant(tenantId) {
    if (!tenantId) return [];
    if (env.useMockApi) {
      return mockListBranchesForTenant(tenantId);
    }
    const { data } = await api.get(`/tenants/${tenantId}/branches`);
    return data;
  },
};

export default branchesService;
