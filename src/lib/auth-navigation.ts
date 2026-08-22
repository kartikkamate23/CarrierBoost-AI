const DEFAULT_AUTH_DESTINATION = "/dashboard";
const AUTH_DESTINATION_KEY = "careerboost:auth-destination";

export function getSafeAuthDestination(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_DESTINATION;
  }

  try {
    const url = new URL(value, "https://careerboost.local");
    if (url.origin !== "https://careerboost.local") return DEFAULT_AUTH_DESTINATION;
    if (
      url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname === "/auth/callback"
    ) {
      return DEFAULT_AUTH_DESTINATION;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_AUTH_DESTINATION;
  }
}

export function rememberAuthDestination(value: unknown) {
  sessionStorage.setItem(AUTH_DESTINATION_KEY, getSafeAuthDestination(value));
}

export function consumeAuthDestination(): string {
  const destination = getSafeAuthDestination(sessionStorage.getItem(AUTH_DESTINATION_KEY));
  sessionStorage.removeItem(AUTH_DESTINATION_KEY);
  return destination;
}
