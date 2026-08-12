import api from "./api.js";
import { env } from "../config/env.js";
import { getPermissionsForRole } from "../constants/permissions.js";
import {
  MOCK_USERS,
  MOCK_TENANTS,
  MOCK_BRANCHES,
  MOCK_PASSWORD,
} from "./mock/mockAuthData.js";

// Auth service layer. Every function returns the SAME shape whether it hit
// the real backend or the mock implementation, so no calling code needs to
// know or care which one is active. Flip VITE_USE_MOCK_API to "false" in
// .env once POST /auth/login exists on the Express backend — no other file
// should need to change.

function simulateNetworkDelay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSessionPayload(user) {
  const tenant = user.tenantId
    ? MOCK_TENANTS.find((t) => t.id === user.tenantId) || null
    : null;
  const branch = user.branchId
    ? MOCK_BRANCHES.find((b) => b.id === user.branchId) || null
    : null;

  return {
    token: `mock-token.${user.id}.${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: getPermissionsForRole(user.role),
      tenantId: user.tenantId,
      branchId: user.branchId,
    },
    tenant,
    branch,
  };
}

async function mockLogin(email, password) {
  await simulateNetworkDelay();

  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );

  if (!user || password !== MOCK_PASSWORD) {
    // Mirrors the shape thrown by the real api.js interceptor so
    // AuthContext can handle both identically.
    throw { message: "Invalid email or password", status: 401 };
  }

  return buildSessionPayload(user);
}

async function mockGetCurrentUser(userId) {
  await simulateNetworkDelay(150);
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) {
    throw { message: "Session user not found", status: 401 };
  }
  return buildSessionPayload(user);
}

// -----------------------------------------------------------------------
// MOCK password-reset flow (request OTP -> verify OTP -> reset password).
// Held in memory only, per browser tab, and only exists because there's
// no backend yet. A real backend would generate/send/verify the OTP
// server-side and never return it to the client — see the `otp` field
// returned by mockRequestPasswordReset, which is ONLY present because
// env.useMockApi is true (used to show a demo hint in the UI).
// -----------------------------------------------------------------------
const OTP_TTL_MS = 10 * 60 * 1000;
const passwordResetStore = new Map();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function mockRequestPasswordReset(email) {
  await simulateNetworkDelay();

  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (!user) {
    throw { message: "No account was found with that email address", status: 404 };
  }

  const otp = generateOtp();
  passwordResetStore.set(email.toLowerCase(), {
    otp,
    verified: false,
    resetToken: null,
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  return { email, otp };
}

async function mockVerifyOtp(email, otp) {
  await simulateNetworkDelay(300);

  const record = passwordResetStore.get(String(email).toLowerCase());
  if (!record || record.expiresAt < Date.now()) {
    throw { message: "This code has expired. Please request a new one.", status: 400 };
  }
  if (record.otp !== String(otp)) {
    throw { message: "That code isn't correct. Please try again.", status: 400 };
  }

  const resetToken = `mock-reset-token.${email}.${Date.now()}`;
  record.verified = true;
  record.resetToken = resetToken;
  passwordResetStore.set(email.toLowerCase(), record);

  return { resetToken };
}

async function mockResetPassword(email, resetToken, newPassword) {
  await simulateNetworkDelay();

  const record = passwordResetStore.get(String(email).toLowerCase());
  if (!record || !record.verified || record.resetToken !== resetToken) {
    throw { message: "Your reset session is invalid. Please start again.", status: 400 };
  }
  if (!newPassword || newPassword.length < 8) {
    throw { message: "Password must be at least 8 characters", status: 422 };
  }

  passwordResetStore.delete(email.toLowerCase());
  // Mock mode never actually mutates MOCK_PASSWORD — the login page's
  // demo credentials keep working regardless. The real backend call
  // below is what will actually change the password once it exists.
  return { success: true };
}

export const authService = {
  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token:string, user:object, tenant:object|null, branch:object|null}>}
   */
  async login(email, password) {
    if (env.useMockApi) {
      return mockLogin(email, password);
    }
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  /**
   * Re-validates/refreshes the current session (e.g. on app load).
   * @param {string} userId only used by the mock implementation
   */
  async getCurrentUser(userId) {
    if (env.useMockApi) {
      return mockGetCurrentUser(userId);
    }
    const { data } = await api.get("/auth/me");
    return data;
  },

  async logout() {
    if (env.useMockApi) {
      await simulateNetworkDelay(150);
      return { success: true };
    }
    const { data } = await api.post("/auth/logout");
    return data;
  },

  /**
   * Step 1 of password reset: request an OTP be sent to the account email.
   * @param {string} email
   * @returns {Promise<{email:string, otp?:string}>} `otp` is only ever
   *   present in mock mode, for the UI's demo hint — never expect it from
   *   a real backend.
   */
  async requestPasswordReset(email) {
    if (env.useMockApi) {
      return mockRequestPasswordReset(email);
    }
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  /**
   * Step 2: verify the OTP the user received.
   * @param {string} email
   * @param {string} otp
   * @returns {Promise<{resetToken:string}>}
   */
  async verifyOtp(email, otp) {
    if (env.useMockApi) {
      return mockVerifyOtp(email, otp);
    }
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    return data;
  },

  /**
   * Step 3: set a new password using the token returned by verifyOtp.
   * @param {string} email
   * @param {string} resetToken
   * @param {string} newPassword
   * @returns {Promise<{success:boolean}>}
   */
  async resetPassword(email, resetToken, newPassword) {
    if (env.useMockApi) {
      return mockResetPassword(email, resetToken, newPassword);
    }
    const { data } = await api.post("/auth/reset-password", {
      email,
      resetToken,
      newPassword,
    });
    return data;
  },
};

export default authService;
