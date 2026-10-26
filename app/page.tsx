import { PatentHome } from "@/components/worlds/patent/patent-home";

/** `/` serves the default world. The proxy rewrites other worlds to /w/[world]. */
export default function Page() {
  return <PatentHome />;
}
