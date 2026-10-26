import { describe, expect, test } from "vitest";
import { DEFAULT_WORLD, WORLDS, WORLD_BOOT_SCRIPT, parseWorld, worldHomePath } from "@/lib/worlds";

describe("worlds", () => {
  test("parses known worlds and rejects everything else", () => {
    for (const world of WORLDS) expect(parseWorld(world)).toBe(world);
    expect(parseWorld("nope")).toBeNull();
    expect(parseWorld(undefined)).toBeNull();
    expect(parseWorld("")).toBeNull();
  });

  test("the default world lives at /, the others under /w/", () => {
    expect(worldHomePath(DEFAULT_WORLD)).toBe("/");
    expect(worldHomePath("lid")).toBe("/w/lid");
  });

  test("the boot script reads the cookie and falls back to the default", () => {
    const run = (cookie: string, pathname = "/") => {
      const root = { dataset: {} as Record<string, string> };
      new Function("document", "location", WORLD_BOOT_SCRIPT)({ cookie, documentElement: root }, { pathname });
      return root.dataset.world;
    };
    expect(run("a=1; world=wall; b=2")).toBe("wall");
    expect(run("world=evil")).toBe(DEFAULT_WORLD);
    expect(run("")).toBe(DEFAULT_WORLD);
  });

  test("the boot script prefers a /w/<world> path over the cookie", () => {
    const run = (cookie: string, pathname: string) => {
      const root = { dataset: {} as Record<string, string> };
      new Function("document", "location", WORLD_BOOT_SCRIPT)({ cookie, documentElement: root }, { pathname });
      return root.dataset.world;
    };
    expect(run("world=lid", "/w/wall")).toBe("wall");
    expect(run("world=lid", "/about")).toBe("lid");
    expect(run("", "/w/nope")).toBe(DEFAULT_WORLD);
  });
});

describe("A/B helpers", () => {
  test("pickAbWorld spreads across all four worlds", async () => {
    const { pickAbWorld } = await import("@/lib/worlds");
    expect([0, 0.3, 0.6, 0.99].map(pickAbWorld)).toEqual(["patent", "lid", "wall", "canon"]);
    expect(pickAbWorld(1)).toBe("canon");
  });

  test("isNonHumanAgent spots crawlers and agents, not browsers", async () => {
    const { isNonHumanAgent } = await import("@/lib/worlds");
    expect(isNonHumanAgent("Googlebot/2.1")).toBe(true);
    expect(isNonHumanAgent("GPTBot/1.0")).toBe(true);
    expect(isNonHumanAgent(null)).toBe(true);
    expect(isNonHumanAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1")).toBe(false);
  });
});
