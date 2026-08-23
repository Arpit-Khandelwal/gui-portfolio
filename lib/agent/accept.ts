/**
 * RFC 9110 §12.5.1 Accept-header negotiation, scoped to the media types this
 * site can actually serve.
 *
 * Implemented for acceptmarkdown.com compliance:
 *   - serve `text/markdown` when the client prefers it
 *   - honour q-values (including `q=0` as an explicit refusal)
 *   - answer `406` when the client accepts nothing we can produce
 *
 * The 406 path is deliberately conservative: a missing or empty Accept header
 * is never a refusal, because curl (`*​/*`), Next's RSC fetches and most
 * crawlers would otherwise be rejected.
 */

export const MEDIA_HTML = "text/html";
export const MEDIA_MARKDOWN = "text/markdown";

/** Ordered by preference: ties resolve to the first entry. */
export const SUPPORTED_MEDIA_TYPES = [MEDIA_HTML, MEDIA_MARKDOWN] as const;

export type SupportedMediaType = (typeof SUPPORTED_MEDIA_TYPES)[number];

type MediaRange = {
  type: string;
  subtype: string;
  quality: number;
  /** 2 = exact type/subtype, 1 = `type/*`, 0 = `*​/*`. */
  specificity: 0 | 1 | 2;
};

function parseQuality(parameters: readonly string[]) {
  for (const parameter of parameters) {
    const [rawKey, ...rest] = parameter.split("=");
    if (rawKey.trim().toLowerCase() !== "q") continue;
    const value = Number.parseFloat(rest.join("=").trim());
    if (Number.isNaN(value)) return 1;
    return Math.min(Math.max(value, 0), 1);
  }
  return 1;
}

export function parseAcceptHeader(header: string | null | undefined): MediaRange[] {
  if (!header) return [];
  return header
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const [rawMedia, ...parameters] = entry.split(";");
      const [type, subtype] = rawMedia.trim().toLowerCase().split("/");
      if (!type || !subtype) return [];
      const specificity: MediaRange["specificity"] =
        type === "*" ? 0 : subtype === "*" ? 1 : 2;
      return [{ type, subtype, quality: parseQuality(parameters), specificity }];
    });
}

function matchQuality(ranges: readonly MediaRange[], mediaType: string) {
  const [type, subtype] = mediaType.split("/");
  let best: MediaRange | null = null;
  for (const range of ranges) {
    const matches =
      range.specificity === 0 ||
      (range.specificity === 1 && range.type === type) ||
      (range.type === type && range.subtype === subtype);
    if (!matches) continue;
    if (!best || range.specificity > best.specificity) best = range;
  }
  return best ? best.quality : null;
}

export type Negotiation =
  | { outcome: "match"; mediaType: SupportedMediaType }
  | { outcome: "not-acceptable" };

/**
 * Pick the best supported media type for an Accept header.
 *
 * Returns `not-acceptable` only when the header is present and explicitly
 * excludes (or zero-weights) everything we serve.
 */
export function negotiateMediaType(header: string | null | undefined): Negotiation {
  const ranges = parseAcceptHeader(header);
  if (ranges.length === 0) return { outcome: "match", mediaType: MEDIA_HTML };

  let winner: { mediaType: SupportedMediaType; quality: number } | null = null;
  for (const mediaType of SUPPORTED_MEDIA_TYPES) {
    const quality = matchQuality(ranges, mediaType);
    if (quality === null || quality === 0) continue;
    if (!winner || quality > winner.quality) winner = { mediaType, quality };
  }

  return winner ? { outcome: "match", mediaType: winner.mediaType } : { outcome: "not-acceptable" };
}
