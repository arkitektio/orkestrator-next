import { ColorMap } from "@/mikro-next/api/graphql";
import { SceneLayerFragment } from "@/mikro-next/api/graphql";

export const COLORMAP_OPTIONS = Object.values(ColorMap);

export const sampleColormapCSS = (
  colormap: ColorMap | null | undefined,
  t: number,
): string => {
  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
  const toRGB = (r: number, g: number, b: number) =>
    `rgb(${Math.round(clamp(r) * 255)},${Math.round(clamp(g) * 255)},${Math.round(clamp(b) * 255)})`;

  switch (colormap) {
    case ColorMap.Red:
      return toRGB(t, 0, 0);
    case ColorMap.Green:
      return toRGB(0, t, 0);
    case ColorMap.Blue:
      return toRGB(0, 0, t);
    case ColorMap.Grey:
      return toRGB(t, t, t);
    case ColorMap.Cool:
      return toRGB(t, 1 - t, 1);
    case ColorMap.Warm:
      return toRGB(1, t, 0);
    case ColorMap.Plasma: {
      const c0 = [0.050383, 0.029803, 0.527975];
      const c1 = [0.063536, 0.28201, 1.28706];
      const c2 = [0.047002, -0.027879, -0.376627];
      const c3 = [0.081427, -1.81901, 1.43231];
      const c4 = [0.105724, 8.46568, -3.89642];
      return toRGB(
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2]))),
      );
    }
    case ColorMap.Inferno: {
      const c0 = [0.0014615, 0.000466, 0.013866];
      const c1 = [0.120565, 0.675951, 0.669823];
      const c2 = [-0.0041943, -0.411412, -0.0498334];
      const c3 = [0.0411583, 1.0048, 0.728707];
      const c4 = [0.0745821, -3.65852, -1.35202];
      return toRGB(
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2]))),
      );
    }
    case ColorMap.Magma: {
      const c0 = [0.001462, 0.000466, 0.013866];
      const c1 = [0.078815, 0.674501, 0.973988];
      const c2 = [0.138051, -0.411412, -0.814952];
      const c3 = [-0.126219, 1.0048, 1.66697];
      const c4 = [0.0582235, -3.65852, -2.87069];
      return toRGB(
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2]))),
      );
    }
    default: {
      const c0 = [0.277727, 0.005407, 0.3341];
      const c1 = [0.105093, 1.40461, 1.38459];
      const c2 = [-0.330861, 0.214847, 0.095095];
      const c3 = [-4.63423, -5.7991, -19.3324];
      const c4 = [6.22827, 14.1799, 56.6906];
      const c5 = [4.77638, -13.7451, -65.353];
      const c6 = [-5.43546, 4.64585, 26.3124];
      return toRGB(
        c0[0] +
          t *
            (c1[0] +
              t *
                (c2[0] +
                  t *
                    (c3[0] + t * (c4[0] + t * (c5[0] + t * c6[0]))))),
        c0[1] +
          t *
            (c1[1] +
              t *
                (c2[1] +
                  t *
                    (c3[1] + t * (c4[1] + t * (c5[1] + t * c6[1]))))),
        c0[2] +
          t *
            (c1[2] +
              t *
                (c2[2] +
                  t *
                    (c3[2] + t * (c4[2] + t * (c5[2] + t * c6[2]))))),
      );
    }
  }
};

export const colormapGradientCSS = (
  colormap: ColorMap | null | undefined,
  stops = 32,
): string => {
  const colors = Array.from({ length: stops }, (_, i) =>
    sampleColormapCSS(colormap, i / (stops - 1)),
  );
  return `linear-gradient(to right, ${colors.join(", ")})`;
};

export const isLayerDirty = (
  current: SceneLayerFragment,
  original: SceneLayerFragment | undefined,
): boolean => {
  if (!original) return true;
  return (
    current.climMin !== original.climMin ||
    current.climMax !== original.climMax ||
    current.colormap !== original.colormap ||
    current.xDim !== original.xDim ||
    current.yDim !== original.yDim ||
    current.zDim !== original.zDim ||
    current.intensityDim !== original.intensityDim
  );
};
