import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getRequestOrigin = createServerFn({ method: "GET" }).handler(() => {
  const req = getRequest();
  const url = new URL(req.url);
  const sandboxHost = url.hostname === "localhost" ? req.headers.get("x-forwarded-host") : null;
  return sandboxHost ? `https://${sandboxHost}` : url.origin;
});

export async function currentOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return getRequestOrigin();
}

export function absoluteUrl(src: string | undefined, origin: string) {
  if (!src) return undefined;
  try {
    return new URL(src, origin).toString();
  } catch {
    return undefined;
  }
}
