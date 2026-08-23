/**
 * Minimal JSON-to-YAML serialiser, used to publish the OpenAPI document as
 * YAML without pulling in a dependency.
 *
 * Every scalar is emitted with `JSON.stringify`. YAML 1.2 is a superset of
 * JSON, so a JSON-quoted string is always a valid YAML double-quoted scalar —
 * which sidesteps the whole class of quoting bugs around `:`, `#`, `*`, `-`,
 * leading whitespace, and strings that look like numbers or booleans.
 */
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const INDENT = "  ";

function isPlainObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function serialise(value: JsonValue, depth: number): string {
  const pad = INDENT.repeat(depth);

  if (Array.isArray(value)) {
    if (value.length === 0) return " []";
    return `\n${value
      .map((item) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          const nested = serialise(item, depth + 1).replace(/^\n/, "");
          return `${pad}-\n${nested}`;
        }
        return `${pad}- ${JSON.stringify(item)}`;
      })
      .join("\n")}`;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return " {}";
    return `\n${entries
      .map(([key, entry]) => `${pad}${JSON.stringify(key)}:${serialise(entry as JsonValue, depth + 1)}`)
      .join("\n")}`;
  }

  return ` ${JSON.stringify(value)}`;
}

export function toYaml(value: unknown): string {
  const normalised = JSON.parse(JSON.stringify(value)) as JsonValue;
  if (!isPlainObject(normalised)) return `${serialise(normalised, 0).trimStart()}\n`;
  return `${serialise(normalised, 0).replace(/^\n/, "")}\n`;
}
