"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_WORLD,
  WORLDS,
  WORLD_COOKIE,
  WORLD_COOKIE_MAX_AGE,
  WORLD_LABELS,
  parseWorld,
  type WorldId,
} from "@/lib/worlds";
import { track } from "@/lib/analytics";

const WORLD_EVENT = "world-change";

function subscribe(callback: () => void) {
  window.addEventListener(WORLD_EVENT, callback);
  return () => window.removeEventListener(WORLD_EVENT, callback);
}

/** Stores the choice and re-themes the current document. */
function applyWorld(world: WorldId): void {
  document.cookie = `${WORLD_COOKIE}=${world}; path=/; max-age=${WORLD_COOKIE_MAX_AGE}; samesite=lax`;
  document.documentElement.dataset.world = world;
  window.dispatchEvent(new Event(WORLD_EVENT));
}

function readWorld(): WorldId {
  return parseWorld(document.documentElement.dataset.world) ?? DEFAULT_WORLD;
}

interface WorldSwitcherProps {
  /** The world the surrounding page renders. Wins over the cookie on /w/* routes. */
  current?: WorldId;
  className?: string;
}

/**
 * Picks the site's visual world. The choice is stored in a cookie; the proxy
 * reads it to serve the matching homepage, and the boot script in <head> reads
 * it to theme every other page before first paint.
 */
export function WorldSwitcher({ current, className }: WorldSwitcherProps) {
  const pathname = usePathname();
  const stored = useSyncExternalStore(subscribe, readWorld, () => current ?? DEFAULT_WORLD);
  const active = current ?? stored;

  const choose = (world: WorldId) => {
    if (world === active) return;
    track("world_switch", { from: active, to: world, path: pathname });
    applyWorld(world);
    // The homepage is a different prerendered page per world, so it reloads.
    // Every other page only swaps tokens, which the attribute above already did.
    if (pathname === "/" || pathname.startsWith("/w/")) window.location.assign("/");
  };

  return (
    <div className={`world-switcher ${className ?? ""}`} role="group" aria-label="Site look">
      {WORLDS.map((world) => (
        <button
          key={world}
          type="button"
          aria-pressed={world === active}
          className="world-switcher-option"
          data-world-option={world}
          onClick={() => choose(world)}
        >
          {WORLD_LABELS[world]}
        </button>
      ))}
    </div>
  );
}
