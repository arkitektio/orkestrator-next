import * as THREE from "three";

export const createColormapTexture = (colors: number[][]) => {
  const size = colors.length;
  const data = new Uint8Array(size * 4);

  for (let i = 0; i < size; i++) {
    data[i * 4] = Math.round(colors[i][0] * 255);
    data[i * 4 + 1] = Math.round(colors[i][1] * 255);
    data[i * 4 + 2] = Math.round(colors[i][2] * 255);
    data[i * 4 + 3] =
      colors[i].length > 3 ? Math.round(colors[i][3] * 255) : 255;
  }

  const texture = new THREE.DataTexture(data, size, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
};

export const createDiscreteColormapTexture = (colors: number[][]) => {
  const size = colors.length;
  const data = new Uint8Array(size * 4);

  for (let i = 0; i < size; i++) {
    data[i * 4] = Math.round(colors[i][0] * 255);
    data[i * 4 + 1] = Math.round(colors[i][1] * 255);
    data[i * 4 + 2] = Math.round(colors[i][2] * 255);
    data[i * 4 + 3] =
      colors[i].length > 3 ? Math.round(colors[i][3] * 255) : 255;
  }

  const texture = new THREE.DataTexture(data, size, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
};

// Red colormap
export const redColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => [i / 255, 0, 0]),
);

// Green colormap
export const greenColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => [0, i / 255, 0]),
);

// Blue colormap
export const blueColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => [0, 0, i / 255]),
);

// Viridis colormap
export const viridisColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    const c0 = [0.277727, 0.005407, 0.3341];
    const c1 = [0.105093, 1.40461, 1.38459];
    const c2 = [-0.330861, 0.214847, 0.095095];
    const c3 = [-4.63423, -5.7991, -19.3324];
    const c4 = [6.22827, 14.1799, 56.6906];
    const c5 = [4.77638, -13.7451, -65.353];
    const c6 = [-5.43546, 4.64585, 26.3124];

    const viridis = (t: number) => {
      return [
        c0[0] +
        t *
        (c1[0] +
          t *
          (c2[0] + t * (c3[0] + t * (c4[0] + t * (c5[0] + t * c6[0]))))),
        c0[1] +
        t *
        (c1[1] +
          t *
          (c2[1] + t * (c3[1] + t * (c4[1] + t * (c5[1] + t * c6[1]))))),
        c0[2] +
        t *
        (c1[2] +
          t *
          (c2[2] + t * (c3[2] + t * (c4[2] + t * (c5[2] + t * c6[2]))))),
      ];
    };

    const [r, g, b] = viridis(t);
    return [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1),
    ];
  }),
);

// Plasma colormap (matplotlib)
export const plasmaColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    const c0 = [0.050383, 0.029803, 0.527975];
    const c1 = [0.063536, 0.28201, 1.28706];
    const c2 = [0.047002, -0.027879, -0.376627];
    const c3 = [0.081427, -1.81901, 1.43231];
    const c4 = [0.105724, 8.46568, -3.89642];

    const plasma = (t: number) => {
      return [
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2]))),
      ];
    };

    const [r, g, b] = plasma(t);
    return [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1),
    ];
  }),
);

// Inferno colormap (matplotlib)
export const infernoColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    const c0 = [0.0014615, 0.000466, 0.013866];
    const c1 = [0.120565, 0.675951, 0.669823];
    const c2 = [-0.0041943, -0.411412, -0.0498334];
    const c3 = [0.0411583, 1.0048, 0.728707];
    const c4 = [0.0745821, -3.65852, -1.35202];

    const inferno = (t: number) => {
      return [
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2]))),
      ];
    };

    const [r, g, b] = inferno(t);
    return [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1),
    ];
  }),
);

// Magma colormap (matplotlib)
export const magmaColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    const c0 = [0.001462, 0.000466, 0.013866];
    const c1 = [0.078815, 0.674501, 0.973988];
    const c2 = [0.138051, -0.411412, -0.814952];
    const c3 = [-0.126219, 1.0048, 1.66697];
    const c4 = [0.0582235, -3.65852, -2.87069];

    const magma = (t: number) => {
      return [
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2]))),
      ];
    };

    const [r, g, b] = magma(t);
    return [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1),
    ];
  }),
);

// Jet colormap (classic matplotlib colormap)
export const jetColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    let r, g, b;

    if (t < 0.125) {
      r = 0;
      g = 0;
      b = 0.5 + 4 * t;
    } else if (t < 0.375) {
      r = 0;
      g = 4 * (t - 0.125);
      b = 1;
    } else if (t < 0.625) {
      r = 4 * (t - 0.375);
      g = 1;
      b = 1 - 4 * (t - 0.375);
    } else if (t < 0.875) {
      r = 1;
      g = 1 - 4 * (t - 0.625);
      b = 0;
    } else {
      r = 1 - 4 * (t - 0.875);
      g = 0;
      b = 0;
    }

    return [r, g, b];
  }),
);

// Hot colormap (similar to matplotlib hot)
export const hotColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    let r, g, b;

    if (t < 1 / 3) {
      r = 3 * t;
      g = 0;
      b = 0;
    } else if (t < 2 / 3) {
      r = 1;
      g = 3 * (t - 1 / 3);
      b = 0;
    } else {
      r = 1;
      g = 1;
      b = 3 * (t - 2 / 3);
    }

    return [r, g, b];
  }),
);

// Cool colormap (similar to matplotlib cool)
export const coolColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    return [t, 1 - t, 1];
  }),
);

// Gray/Grayscale colormap
export const grayColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    return [t, t, t];
  }),
);

// Bone colormap (similar to matplotlib bone)
export const boneColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    let r, g, b;

    if (t < 3 / 8) {
      r = 7 / 8 * t;
      g = 7 / 8 * t;
      b = 29 / 24 * t;
    } else if (t < 3 / 4) {
      r = 1 / 8 + 7 / 8 * t;
      g = 1 / 8 + 7 / 8 * t;
      b = 29 / 24 * (3 / 8) + (t - 3 / 8);
    } else {
      r = 1 / 8 + 7 / 8 * t;
      g = 1 / 8 + 7 / 8 * (3 / 4) + (t - 3 / 4);
      b = 29 / 24 * (3 / 8) + (3 / 4 - 3 / 8) + (t - 3 / 4);
    }

    return [
      Math.min(Math.max(r, 0), 1),
      Math.min(Math.max(g, 0), 1),
      Math.min(Math.max(b, 0), 1),
    ];
  }),
);

// Spring colormap (similar to matplotlib spring)
export const springColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    return [1, t, 1 - t];
  }),
);

// Summer colormap (similar to matplotlib summer)
export const summerColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    return [t, 0.5 + 0.5 * t, 0.4];
  }),
);

// Autumn colormap (similar to matplotlib autumn)
export const autumnColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    return [1, t, 0];
  }),
);

// Winter colormap (similar to matplotlib winter)
export const winterColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;
    return [0, t, 1 - 0.5 * t];
  }),
);

// Turbo colormap (Google's turbo colormap, used in matplotlib)
export const turboColormap = createColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    const t = i / 255;

    const turbo = (t: number) => {
      const kRedVec4 = [0.13572138, 4.61539260, -42.66032258, 132.13108234];
      const kGreenVec4 = [0.09140261, 2.19418839, 4.84296658, -14.18503333];
      const kBlueVec4 = [0.10667330, 12.64194608, -60.58204836, 110.36276771];
      const kRedVec2 = [-152.94239396, 59.28637943];
      const kGreenVec2 = [4.27729857, 2.82956604];
      const kBlueVec2 = [-89.90310912, 27.34824973];

      const v4 = [1.0, t, t * t, t * t * t];
      const v2 = [v4[2] * v4[2], v4[2] * v4[3]];

      const r = Math.min(Math.max(
        kRedVec4[0] * v4[0] + kRedVec4[1] * v4[1] + kRedVec4[2] * v4[2] + kRedVec4[3] * v4[3] +
        kRedVec2[0] * v2[0] + kRedVec2[1] * v2[1], 0), 1);

      const g = Math.min(Math.max(
        kGreenVec4[0] * v4[0] + kGreenVec4[1] * v4[1] + kGreenVec4[2] * v4[2] + kGreenVec4[3] * v4[3] +
        kGreenVec2[0] * v2[0] + kGreenVec2[1] * v2[1], 0), 1);

      const b = Math.min(Math.max(
        kBlueVec4[0] * v4[0] + kBlueVec4[1] * v4[1] + kBlueVec4[2] * v4[2] + kBlueVec4[3] * v4[3] +
        kBlueVec2[0] * v2[0] + kBlueVec2[1] * v2[1], 0), 1);

      return [r, g, b];
    };

    return turbo(t);
  }),
);

// Rainbow/HSV colormap
export const rainbowColormap = createDiscreteColormapTexture(
  Array.from({ length: 256 }, (_, i) => {
    if (i === 0) return [0, 0, 0, 0]; // Transparent background for index 0

    // Golden angle approximation
    const hue = (i * 137.508) % 360;

    // Convert HSV to RGB (with S=1, V=1)
    const c = 1;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = 0;

    let r, g, b;
    if (hue >= 0 && hue < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (hue >= 60 && hue < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (hue >= 120 && hue < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (hue >= 180 && hue < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (hue >= 240 && hue < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return [r + m, g + m, b + m, 1];
  }),
);
