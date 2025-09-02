import { cookies } from "next/headers";
import { getBackendBaseUrl } from "../lib/config";

export async function getAuthTokenFromCookies(): Promise<string | undefined> {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    return token;
  } catch {
    return undefined;
  }
}

export async function proxyToBackend(
  path: string,
  init: RequestInit = {},
  options?: { includeAuth?: boolean }
) {
  const base = getBackendBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers as HeadersInit);
  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }
  if (options?.includeAuth) {
    const token = await getAuthTokenFromCookies();
    if (token) headers.set("authorization", token);
  }
  const res = await fetch(url, { ...init, headers });
  return res;
}


