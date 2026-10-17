import { describe, expect, test } from "vitest";
import { requiresConsent } from "@/lib/consent-region";
import { GET } from "@/app/consent-region/route";

describe("requiresConsent", () => {
  test("asks visitors in the EU, EEA, UK and Switzerland", () => {
    for (const country of ["DE", "FR", "IE", "PL", "NO", "IS", "LI", "GB", "CH"]) {
      expect(requiresConsent(country), country).toBe(true);
    }
  });

  test("does not ask visitors elsewhere", () => {
    for (const country of ["IN", "US", "AE", "SG", "AU"]) {
      expect(requiresConsent(country), country).toBe(false);
    }
  });

  test("fails safe and asks when the country is unknown", () => {
    expect(requiresConsent(null)).toBe(true);
    expect(requiresConsent("")).toBe(true);
    expect(requiresConsent("XX")).toBe(false);
  });

  test("ignores case", () => {
    expect(requiresConsent("de")).toBe(true);
  });
});

describe("GET /consent-region", () => {
  test("answers from Vercel's country header and is never cached", async () => {
    const response = GET(
      new Request("https://www.arpitkhandelwal.com/consent-region", {
        headers: { "x-vercel-ip-country": "FR" },
      }),
    );

    expect(await response.json()).toEqual({ requiresConsent: true });
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  test("lets visitors from India through without a banner", async () => {
    const response = GET(
      new Request("https://www.arpitkhandelwal.com/consent-region", {
        headers: { "x-vercel-ip-country": "IN" },
      }),
    );

    expect(await response.json()).toEqual({ requiresConsent: false });
  });
});
