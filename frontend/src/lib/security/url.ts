/**
 * Validates whether a given URL is a safe internal relative path for redirection.
 * Prevents Open Redirect vulnerabilities by enforcing relative path format and rejecting:
 * - External domains / absolute URLs (e.g., https://evil.com, http://evil.com)
 * - Protocol-relative URLs starting with '//' or '///' or encoded equivalents (e.g., //evil.com, /%2F%2Fevil.com)
 * - Backslash bypass patterns (e.g., /\\evil.com, /%5C%5Cevil.com, \\evil.com)
 * - Control characters, NULL bytes, or newlines (raw or encoded)
 * - Pseudo-protocols / schemes (e.g., javascript:, data:, vbscript:)
 * - Path traversal bypasses (e.g., /%2e%2e/%2e%2e/evil)
 */
export function isSafeReturnUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;

  let trimmed = url.trim();

  // Reject raw control characters or newlines
  if (/[\r\n\t\0\u0000-\u001F\u007F-\u009F]/.test(trimmed)) return false;

  // Try URL decoding to catch double/single URL encoded bypasses
  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    // Malformed URI component sequence
    return false;
  }

  // Reject if decoded string contains control characters
  if (/[\r\n\t\0\u0000-\u001F\u007F-\u009F]/.test(decoded)) return false;

  // Both raw and decoded strings must start with '/'
  if (!trimmed.startsWith("/") || !decoded.startsWith("/")) return false;

  // Reject protocol-relative URLs starting with '//' or '///' or '/\'
  if (
    trimmed.startsWith("//") ||
    decoded.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    decoded.startsWith("/\\")
  ) {
    return false;
  }

  // Reject any backslashes in raw or decoded
  if (trimmed.includes("\\") || decoded.includes("\\")) return false;

  // Reject scheme/pseudo-protocols in raw or decoded (e.g. javascript:, data:, vbscript:, http:, https:)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded)) {
    return false;
  }

  // Reject schemes anywhere inside decoded string if formatted as protocol
  if (/(javascript|vbscript|data|file|about|chrome|blob):/i.test(decoded)) {
    return false;
  }

  try {
    const dummyBase = "http://localhost:3000";
    const parsed = new URL(trimmed, dummyBase);

    // Ensure origin matches dummyBase exactly (no external domain resolution)
    if (parsed.origin !== dummyBase) return false;

    // Ensure pathname is a valid internal relative path starting with '/'
    if (!parsed.pathname.startsWith("/")) return false;

    // Ensure parsed pathname does not start with '//' or contains '\\'
    if (parsed.pathname.startsWith("//") || parsed.pathname.includes("\\")) return false;

    return true;
  } catch {
    return false;
  }
}
