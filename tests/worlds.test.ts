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
