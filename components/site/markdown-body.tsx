import { marked } from "marked";

/**
 * Renders a post body to HTML.
 *
 * The markdown is first-party — it comes from files in this repository, never
 * from user input — so it is rendered without a sanitiser by design. Do not
 * point this at anything an outside party can write.
 */
export function MarkdownBody({ markdown }: { markdown: string }) {
  const html = marked.parse(markdown, { async: false, gfm: true });
  return <div className="writing-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
