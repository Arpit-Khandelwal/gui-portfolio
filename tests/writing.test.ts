import { describe, expect, test } from "vitest";
import { parseFrontMatter } from "@/lib/writing/frontmatter";
import { allPosts, findPost, publishedPosts } from "@/lib/writing/posts";
import { findAgentDocument, allAgentDocumentPaths } from "@/lib/agent/markdown";
import { buildArticleJsonLd } from "@/lib/agent/json-ld";
import { buildLlmsTxt } from "@/lib/agent/llms-txt";
import sitemap from "@/app/sitemap";
import { GET as getRss } from "@/app/writing/rss.xml/route";
import { absoluteUrl, SITE_URL } from "@/lib/site";

describe("parseFrontMatter", () => {
  test("splits front matter from the body", () => {
    const { data, body } = parseFrontMatter('---\ntitle: "Hi"\n---\nBody text.');
    expect(data.title).toBe("Hi");
    expect(body).toBe("Body text.");
  });

  test("reads booleans and bracketed string lists", () => {
    const { data } = parseFrontMatter("---\ndraft: true\ntags: [a, b, c]\npublic: false\n---\nx");
    expect(data.draft).toBe(true);
    expect(data.public).toBe(false);
    expect(data.tags).toEqual(["a", "b", "c"]);
  });

  test("strips single and double quotes but keeps inner colons", () => {
    const { data } = parseFrontMatter(`---\na: "x: y"\nb: 'z'\nc: bare\n---\n`);
    expect(data).toEqual({ a: "x: y", b: "z", c: "bare" });
  });

  test("returns the whole input as body when there is no front matter", () => {
    expect(parseFrontMatter("# Just markdown")).toEqual({ data: {}, body: "# Just markdown" });
  });

  test("tolerates an unterminated front-matter block", () => {
    expect(parseFrontMatter("---\ntitle: x\nno end").data).toEqual({});
  });

  test("handles CRLF line endings", () => {
    expect(parseFrontMatter("---\r\ntitle: x\r\n---\r\nbody").data.title).toBe("x");
  });
});

describe("post loading", () => {
  const posts = allPosts();

  test("finds the seeded stubs", () => {
    expect(posts.length).toBeGreaterThanOrEqual(5);
  });

  test("every post has the front matter the routes depend on", () => {
    for (const post of posts) {
      expect(post.title, post.slug).toBeTruthy();
      expect(post.description, post.slug).toBeTruthy();
      expect(post.date, post.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.path, post.slug).toBe(`/writing/${post.slug}`);
      expect(post.body.length, post.slug).toBeGreaterThan(200);
    }
  });

  test("slugs are unique", () => {
    const slugs = posts.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("orders newest first", () => {
    const dates = posts.map((post) => post.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  test("findPost resolves by slug and rejects unknown ones", () => {
    expect(findPost(posts[0].slug)?.title).toBe(posts[0].title);
    expect(findPost("no-such-post")).toBeUndefined();
  });

  test("the seeded stubs are all drafts, so nothing half-written ships", () => {
    expect(posts.every((post) => post.draft)).toBe(true);
  });
});

describe("agent surface", () => {
  test("posts resolve as markdown documents", () => {
    const post = allPosts()[0];
    const document = findAgentDocument(post.path);
    expect(document?.title).toBe(post.title);
    expect(document?.render()).toContain(`# ${post.title}`);
  });

  test("a nested or unknown writing path resolves to nothing", () => {
    expect(findAgentDocument("/writing/a/b")).toBeUndefined();
    expect(findAgentDocument("/writing/nope")).toBeUndefined();
  });

  test("the writing index document lists published posts", () => {
    const rendered = findAgentDocument("/writing")!.render();
    expect(rendered.startsWith("# Writing")).toBe(true);
    for (const post of publishedPosts()) {
      expect(rendered).toContain(post.title);
    }
  });

  test("allAgentDocumentPaths includes both static pages and posts", () => {
    const paths = allAgentDocumentPaths();
    expect(paths).toContain("/writing");
    for (const post of publishedPosts()) expect(paths).toContain(post.path);
  });

  test("published posts appear in the sitemap on the canonical host", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(absoluteUrl("/writing"));
    for (const post of publishedPosts()) expect(urls).toContain(absoluteUrl(post.path));
  });

  test("llms.txt links the writing index and every published post", () => {
    const content = buildLlmsTxt();
    expect(content).toContain(absoluteUrl("/writing"));
    for (const post of publishedPosts()) expect(content).toContain(post.title);
  });
});

describe("Article JSON-LD", () => {
  const post = allPosts()[0];
  const article = buildArticleJsonLd(post) as Record<string, unknown>;

  test("is an Article with the fields Google requires", () => {
    expect(article["@type"]).toBe("Article");
    expect(article.headline).toBe(post.title);
    expect(article.datePublished).toBe(post.date);
    expect(article.url).toBe(absoluteUrl(post.path));
  });

  test("references the homepage identity graph rather than restating it", () => {
    expect(article.author).toEqual({ "@id": `${SITE_URL}/#person` });
    expect(article.publisher).toEqual({ "@id": `${SITE_URL}/#organization` });
  });

  test("serialises without breaking out of the script tag", () => {
    expect(JSON.stringify(article)).not.toContain("</script");
  });
});

describe("RSS feed", () => {
  test("parses as well-formed XML with one item per published post", async () => {
    const { XMLParser, XMLValidator } = await import("fast-xml-parser");
    const response = getRss();
    expect(response.headers.get("content-type")).toContain("application/rss+xml");

    const xml = await response.text();
    expect(XMLValidator.validate(xml)).toBe(true);

    const feed = new XMLParser({ ignoreAttributes: false }).parse(xml);
    expect(feed.rss["@_version"]).toBe("2.0");

    const items = [feed.rss.channel.item].flat().filter(Boolean);
    expect(items).toHaveLength(publishedPosts().length);
    expect(items.map((item: { title: string }) => item.title)).toEqual(
      publishedPosts().map((post) => post.title),
    );
  });

  test("declares a self-referencing atom link and a channel link", async () => {
    const { XMLParser } = await import("fast-xml-parser");
    const feed = new XMLParser({ ignoreAttributes: false }).parse(await getRss().text());
    expect(feed.rss.channel["atom:link"]["@_href"]).toBe(absoluteUrl("/writing/rss.xml"));
    expect(feed.rss.channel.link).toBe(absoluteUrl("/writing"));
  });

  test("uses RFC 822 pubDates, which RSS readers require", async () => {
    const xml = await getRss().text();
    for (const match of xml.matchAll(/<pubDate>([^<]*)<\/pubDate>/g)) {
      expect(Number.isNaN(new Date(match[1]).getTime())).toBe(false);
      expect(match[1]).toMatch(/GMT$/);
    }
  });

  test("escapes metacharacters so a title with markup cannot break the feed", async () => {
    const { XMLValidator } = await import("fast-xml-parser");
    const xml = await getRss().text();
    expect(XMLValidator.validate(xml)).toBe(true);
    // Ampersands must be entities, never bare.
    expect(xml).not.toMatch(/&(?!(amp|lt|gt|quot|apos|#\d+);)/);
  });
});
