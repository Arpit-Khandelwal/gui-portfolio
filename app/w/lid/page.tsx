import type { Metadata } from "next";
import { LidHome } from "@/components/worlds/lid/lid-home";

/**
 * The lid world's homepage. Visitors reach it at `/`: the proxy rewrites
 * there when the world cookie asks for it. Each world has its own route so a
 * broken world can never take the others down.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LidHome />;
}
