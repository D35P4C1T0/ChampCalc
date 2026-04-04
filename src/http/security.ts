export const COMMON_SECURITY_HEADERS = Object.freeze({
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
});

export const API_CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

export function buildHtmlContentSecurityPolicy(scriptNonce: string): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "object-src 'none'",
    `script-src 'self' 'nonce-${scriptNonce}'`,
    "style-src 'self' 'unsafe-inline'",
  ].join("; ");
}

export function createSecurityHeaders(
  overrides: Record<string, string> = {},
): Headers {
  const headers = new Headers({
    ...COMMON_SECURITY_HEADERS,
    "Content-Security-Policy": API_CONTENT_SECURITY_POLICY,
  });

  for (const [key, value] of Object.entries(overrides)) {
    headers.set(key, value);
  }

  return headers;
}
