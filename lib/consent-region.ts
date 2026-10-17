/**
 * Where analytics cookies need opt-in consent before they are set: the EU and
 * EEA (GDPR), the UK (UK GDPR / PECR) and Switzerland (revFADP). Everyone else
 * gets analytics without a banner.
 */
const CONSENT_COUNTRIES = new Set([
  // EU member states
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
  // EEA, UK, Switzerland
  "IS", "LI", "NO", "GB", "CH",
]);

/** `country` is an ISO 3166-1 alpha-2 code; an unknown country asks, to fail safe. */
export function requiresConsent(country: string | null | undefined): boolean {
  if (!country) return true;
  return CONSENT_COUNTRIES.has(country.toUpperCase());
}
