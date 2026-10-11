import { isHexColor } from "./api";

function luminance(hex: string) {
  let h = hex.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Text color (white or near-black) with the best contrast over a brand hex. */
export function readableOn(hex: unknown): string | null {
  if (!isHexColor(hex)) return null;
  return contrastRatio(hex, "#ffffff") >= contrastRatio(hex, "#14161f") ? "#ffffff" : "#14161f";
}
