export const TARGET_ROLE_STORAGE_KEY = "careerboost-target-role";

export function saveTargetRole(role: string) {
  const value = role.trim();
  if (!value || typeof window === "undefined") return;
  try {
    localStorage.setItem(TARGET_ROLE_STORAGE_KEY, value);
  } catch {
    // Role selection still works for the current page.
  }
}

export function loadTargetRole(fallback = "Data Engineer") {
  if (typeof window === "undefined") return fallback;
  try {
    const analysis = sessionStorage.getItem("careerboost-guest-analysis");
    if (analysis) {
      const parsed = JSON.parse(analysis) as { role?: unknown };
      if (typeof parsed.role === "string" && parsed.role.trim()) return parsed.role.trim();
    }
    return localStorage.getItem(TARGET_ROLE_STORAGE_KEY)?.trim() || fallback;
  } catch {
    return fallback;
  }
}
