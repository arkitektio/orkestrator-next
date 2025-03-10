import * as THREE from "three";

export const createColormapTexture = (colors: number[][]) => {
    const size = colors.length;
    const data = new Uint8Array(size * 4);
    
    for (let i = 0; i < size; i++) {
      data[i * 4] = colors[i][0] * 255;
      data[i * 4 + 1] = colors[i][1] * 255;
      data[i * 4 + 2] = colors[i][2] * 255;
      data[i * 4 + 3] = 255
    }

  
    const texture = new THREE.DataTexture(data, size, 1, THREE.RGBAFormat);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  };
  
  // Red colormap
  export const redColormap = createColormapTexture(
    Array.from({ length: 256 }, (_, i) => [i / 255, 0, 0])
  );
  
  // Green colormap
  export const greenColormap = createColormapTexture(
    Array.from({ length: 256 }, (_, i) => [0, i / 255, 0])
  );
  
  // Blue colormap
  export const blueColormap = createColormapTexture(
    Array.from({ length: 256 }, (_, i) => [0, 0, i / 255])
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
          c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * (c4[0] + t * (c5[0] + t * c6[0]))))),
          c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * (c4[1] + t * (c5[1] + t * c6[1]))))),
          c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * (c4[2] + t * (c5[2] + t * c6[2]))))),
        ];
      };
  
      const [r, g, b] = viridis(t);
      return [Math.min(Math.max(r, 0), 1), Math.min(Math.max(g, 0), 1), Math.min(Math.max(b, 0), 1)];
    })
  );
  