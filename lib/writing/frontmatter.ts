/**
 * Minimal YAML front-matter parser for the writing content files.
 *
 * Deliberately tiny: the front matter is first-party and uses a fixed set of
 * scalar keys, so a full YAML parser would be dead weight at runtime. Values
 * may be quoted (double or single), a bare scalar, `true`/`false`, or a
 * bracketed list of strings.
 */

export type FrontMatter = Record<string, string | boolean | string[]>;

export type ParsedDocument = { data: FrontMatter; body: string };

const DELIMITER = "---";

function parseScalar(raw: string): string | boolean | string[] {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (inner === "") return [];
    return inner.split(",").map((entry) => parseScalar(entry) as string);
  }
  if (
    (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
    (value.startsWith("'") && value.endsWith("'") && value.length > 1)
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseFrontMatter(source: string): ParsedDocument {
  const normalised = source.replace(/\r\n/g, "\n");
  if (!normalised.startsWith(`${DELIMITER}\n`)) {
    return { data: {}, body: normalised.trim() };
  }

  const end = normalised.indexOf(`\n${DELIMITER}`, DELIMITER.length);
  if (end === -1) return { data: {}, body: normalised.trim() };

  const block = normalised.slice(DELIMITER.length + 1, end);
  const body = normalised.slice(end + DELIMITER.length + 1).trim();

  const data: FrontMatter = {};
  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    if (key === "") continue;
    data[key] = parseScalar(trimmed.slice(separator + 1));
  }

  return { data, body };
}
