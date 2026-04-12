/**
 * Convert OKLCh → sRGB hex, matching the CSS chart-N variables in index.css.
 *
 *   chart-1: oklch(0.85  0.13  hue +  0)  — brightest, primary accent
 *   chart-2: oklch(0.77  0.15  hue -  2)
 *   chart-3: oklch(0.70  0.15  hue -  3)
 *   chart-4: oklch(0.60  0.13  hue -  2)
 *   chart-5: oklch(0.51  0.10  hue +  1)  — darkest
 */

function oklchToHex(L: number, C: number, H: number): string {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  // oklab → linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // linear → gamma (sRGB)
  const toGamma = (x: number) => {
    const c = Math.max(0, Math.min(1, x));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  const r = Math.round(toGamma(rLin) * 255);
  const g = Math.round(toGamma(gLin) * 255);
  const bv = Math.round(toGamma(bLin) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bv.toString(16).padStart(2, "0")}`;
}

export type BrandColors = {
  chart1: string; // root / primary
  chart2: string; // active agent / path
  chart3: string; // selected
  chart4: string; // secondary active
  chart5: string; // subtle
};

export function computeBrandColors(brandHue: number): BrandColors {
  return {
    chart1: oklchToHex(0.85, 0.13, brandHue),
    chart2: oklchToHex(0.77, 0.15, brandHue - 2),
    chart3: oklchToHex(0.70, 0.15, brandHue - 3),
    chart4: oklchToHex(0.60, 0.13, brandHue - 2),
    chart5: oklchToHex(0.51, 0.10, brandHue + 1),
  };
}
