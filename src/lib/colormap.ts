/**
 * Instance Segmentation Colormap Utilities
 * 
 * Generates N equidistant colors in HSV space for instance segmentation masks.
 * Colors are evenly distributed around the hue circle for maximum visual distinction.
 */

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RGBAColor extends RGBColor {
  a: number;
}

export interface HSVColor {
  h: number; // hue: 0-360
  s: number; // saturation: 0-100
  v: number; // value: 0-100
}

/**
 * Convert HSV color to RGB
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param v Value/brightness (0-100)
 * @returns RGB color object
 */
export function hsvToRgb(h: number, s: number, v: number): RGBColor {
  // Normalize inputs
  h = h / 60;
  s = s / 100;
  v = v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 1) {
    r = c; g = x; b = 0;
  } else if (h >= 1 && h < 2) {
    r = x; g = c; b = 0;
  } else if (h >= 2 && h < 3) {
    r = 0; g = c; b = x;
  } else if (h >= 3 && h < 4) {
    r = 0; g = x; b = c;
  } else if (h >= 4 && h < 5) {
    r = x; g = 0; b = c;
  } else if (h >= 5 && h < 6) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Generate N equidistant colors for instance segmentation
 * @param numInstances Number of instances to generate colors for
 * @param saturation Saturation value (0-100), defaults to 70
 * @param value Brightness value (0-100), defaults to 90
 * @param startHue Starting hue offset (0-360), defaults to 0
 * @returns Array of RGB colors
 */
export function generateInstanceSegmentationColors(
  numInstances: number,
  saturation: number = 70,
  value: number = 90,
  startHue: number = 0
): RGBColor[] {
  if (numInstances <= 0) {
    return [];
  }

  if (numInstances === 1) {
    return [hsvToRgb(startHue, saturation, value)];
  }

  const colors: RGBColor[] = [];
  const hueStep = 360 / numInstances;

  for (let i = 0; i < numInstances; i++) {
    const hue = (startHue + (i * hueStep)) % 360;
    colors.push(hsvToRgb(hue, saturation, value));
  }

  return colors;
}

/**
 * Generate instance segmentation colors with alpha channel
 * @param numInstances Number of instances to generate colors for
 * @param alpha Alpha value (0-255), defaults to 255
 * @param saturation Saturation value (0-100), defaults to 70
 * @param value Brightness value (0-100), defaults to 90
 * @param startHue Starting hue offset (0-360), defaults to 0
 * @returns Array of RGBA colors
 */
export function generateInstanceSegmentationColorsRGBA(
  numInstances: number,
  alpha: number = 255,
  saturation: number = 70,
  value: number = 90,
  startHue: number = 0
): RGBAColor[] {
  const rgbColors = generateInstanceSegmentationColors(numInstances, saturation, value, startHue);
  return rgbColors.map(color => ({ ...color, a: alpha }));
}

/**
 * Generate colors in the format expected by the colormap library
 * @param numInstances Number of instances to generate colors for
 * @param saturation Saturation value (0-100), defaults to 70
 * @param value Brightness value (0-100), defaults to 90
 * @param startHue Starting hue offset (0-360), defaults to 0
 * @returns Array of [r, g, b, a] arrays compatible with colormap library
 */
export function generateInstanceSegmentationColormapFormat(
  numInstances: number,
  saturation: number = 70,
  value: number = 90,
  startHue: number = 0
): [number, number, number, number][] {
  const colors = generateInstanceSegmentationColorsRGBA(numInstances, 255, saturation, value, startHue);
  return colors.map(color => [color.r, color.g, color.b, color.a] as [number, number, number, number]);
}

/**
 * Get a specific color for an instance ID (0-indexed)
 * @param instanceId The instance ID (0-indexed)
 * @param totalInstances Total number of instances
 * @param saturation Saturation value (0-100), defaults to 70
 * @param value Brightness value (0-100), defaults to 90
 * @param startHue Starting hue offset (0-360), defaults to 0
 * @returns RGB color for the specific instance
 */
export function getInstanceColor(
  instanceId: number,
  totalInstances: number,
  saturation: number = 70,
  value: number = 90,
  startHue: number = 0
): RGBColor {
  if (instanceId < 0 || instanceId >= totalInstances) {
    throw new Error(`Instance ID ${instanceId} is out of range [0, ${totalInstances - 1}]`);
  }

  const hueStep = 360 / totalInstances;
  const hue = (startHue + (instanceId * hueStep)) % 360;
  return hsvToRgb(hue, saturation, value);
}