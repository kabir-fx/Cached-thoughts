export function getBackendBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  }
  return url.replace(/\/$/, "");
}


