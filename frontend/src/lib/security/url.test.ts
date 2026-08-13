import { isSafeReturnUrl } from "./url";

const SAFE_INPUTS = [
  "/",
  "/profil",
  "/admin",
  "/iletisim",
  "/haberler/test",
  "/sss?x=1",
  "/profil#test",
];

const UNSAFE_INPUTS = [
  "//evil.com",
  "///evil.com",
  "/\\\\evil.com",
  "/\\evil.com",
  "/\\/evil.com",
  "\\\\evil.com",
  "https://evil.com",
  "http://evil.com",
  "javascript:alert(1)",
  "data:text/html",
  "vbscript:alert(1)",
  "/%2F%2Fevil.com",
  "/%5C%5Cevil.com",
  "/%2e%2e/%2e%2e/evil",
];

export function runUrlSecurityTests(): { safePassed: boolean; unsafePassed: boolean } {
  let safePassed = true;
  let unsafePassed = true;

  for (const input of SAFE_INPUTS) {
    const result = isSafeReturnUrl(input);
    if (!result) {
      console.error(`[FAIL] Safe input failed validation: "${input}"`);
      safePassed = false;
    }
  }

  for (const input of UNSAFE_INPUTS) {
    const result = isSafeReturnUrl(input);
    if (result) {
      console.error(`[FAIL] Unsafe input passed validation: "${input}"`);
      unsafePassed = false;
    }
  }

  return { safePassed, unsafePassed };
}
