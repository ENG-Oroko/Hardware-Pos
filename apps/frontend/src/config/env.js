// Centralized access to build-time environment variables.
// Never read import.meta.env directly elsewhere; go through this module
// so env handling stays in one place if the strategy changes later.

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== "false",
};
