export const PRESET_COLOR_FAMILIES = [
  "slate",
  "cyan",
  "blue",
  "orange",
  "green",
  "gray",
  "pink",
  "red",
  "sky",
  "yellow",
] as const;

export const PRESET_SHADES = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export const PRESET_ALPHA = [10, 20, 30, 40, 50, 70, 90] as const;

// helper to make "slate-900" / "slate-900/50"
export function presetColors(withAlpha: boolean) {
  const out: string[] = [];
  for (const fam of PRESET_COLOR_FAMILIES) {
    for (const shade of PRESET_SHADES) {
      out.push(`${fam}-${shade}`);
      if (withAlpha) {
        for (const a of PRESET_ALPHA) out.push(`${fam}-${shade}/${a}`);
      }
    }
  }
  return out;
}
