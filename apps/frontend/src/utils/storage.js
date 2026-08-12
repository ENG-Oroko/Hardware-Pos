// Thin wrapper around sessionStorage used ONLY to persist the current
// session token + minimal user snapshot across page reloads.
//
// Rules:
// - Never store a password here or anywhere in the frontend.
// - sessionStorage (not localStorage) is used so the session clears when
//   the browser tab/window is closed, which suits POS terminals better.
// - The token itself is opaque to the frontend; it is only ever attached
//   to outgoing requests, never parsed or trusted for authorization here.

const SESSION_KEY = "hardware_pos_session";

export function saveSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage may be unavailable (e.g. private mode edge cases).
    // Failing silently here is acceptable — the app just won't persist
    // the session across a reload in that environment.
  }
}

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // no-op
  }
}
