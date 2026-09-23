const DEFAULT_CALLBACK_URL = "/dashboard";

export function getSafeCallbackUrl(
  callbackUrl: string | null | undefined,
): string {
  if (!callbackUrl?.trim()) {
    return DEFAULT_CALLBACK_URL;
  }

  let path = callbackUrl.trim();

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      path = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return DEFAULT_CALLBACK_URL;
    }
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return DEFAULT_CALLBACK_URL;
  }

  if (path.startsWith("/login") || path.startsWith("/register")) {
    return DEFAULT_CALLBACK_URL;
  }

  if (path === "/dashboard" || path.startsWith("/dashboard/")) {
    return path;
  }

  return DEFAULT_CALLBACK_URL;
}
