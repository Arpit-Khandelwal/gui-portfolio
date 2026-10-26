import type { Metadata } from "next";
import { CanonHome } from "@/components/worlds/canon/canon-home";

/**
 * The canon world's homepage. Visitors reach it at `/`: the proxy rewrites
 * there when the world cookie asks for it. Each world has its own route so a
 * broken world can never take the others down.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CanonHome />;
}
