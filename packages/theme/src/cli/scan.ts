import fg from "fast-glob";
import { readFileSync } from "node:fs";
import { posix } from "node:path";

type ScanOptions = {
  patterns: string[]; // globs
  safelist?: string[]; // extra classes to force-include
};

const CLASS_RE = [
  /class(Name)?\s*=\s*(?:"([^"]+)"|'([^']+)'|\{`([^`]+)`\}|\{\s*"(.*?)"\s*\}|\{\s*'(.*?)'\s*\})/g, // class= / className=
  /\btw\s*=\s*(?:"([^"]+)"|'([^']+)')/g, // tw="..."
  /\bdata-tw\s*=\s*(?:"([^"]+)"|'([^']+)')/g, // data-tw="..."
  /@apply\s+([^;]+);/g, // @apply in CSS
];

export async function scanClassNames(opts: ScanOptions): Promise<string[]> {
  const DEFAULT_GLOB =
    "**/*.{html,htm,js,jsx,ts,tsx,vue,svelte,md,mdx,css,scss,less}";
  const normalize = (p: string) => posix.normalize(p.replace(/\\/g, "/"));
  const ensureGlob = (p: string) =>
    /[*?{\[]/.test(p) ? p : (p.endsWith("/") ? p : p + "/") + DEFAULT_GLOB;
  const patterns = (opts.patterns ?? []).map(normalize).map(ensureGlob);
  const files = await fg(
    patterns.length
      ? patterns
      : ["src/" + DEFAULT_GLOB, "public/" + DEFAULT_GLOB],
    {
      dot: true,
      onlyFiles: true,
    },
  );

  const out = new Set<string>();

  for (const f of files) {
    const src = readFileSync(f, "utf8");

    for (const re of CLASS_RE) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(src))) {
        // find the first non-undefined capture among groups
        const raw = m[2] ?? m[3] ?? m[4] ?? m[5] ?? m[6] ?? m[1] ?? m[7] ?? "";
        for (const token of tokenizeClasses(raw)) {
          if (token) out.add(token);
        }
      }
    }
  }

  for (const s of opts.safelist ?? []) out.add(s);
  return Array.from(out);
}

function tokenizeClasses(s: string): string[] {
  // split on whitespace but preserve Tailwind tokens that include ':' '/' '[' ']' etc.
  return s
    .split(/\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}
