import * as THREE from "three";

/**
 * Raw partial 3D-texture upload. three r184 has no first-class partial
 * Data3DTexture update path that avoids re-uploading the whole volume, so we
 * talk to WebGL2 directly on three's internal texture handle. All brick and
 * page-level buffers are contiguous exactly at their upload extents, so the
 * default (zeroed) UNPACK_ROW_LENGTH/IMAGE_HEIGHT semantics apply.
 */

export type TexelKind = "r8" | "r32f" | "rgba8ui";

export function uploadTexSubImage3D(
  renderer: THREE.WebGLRenderer,
  texture: THREE.Data3DTexture,
  kind: TexelKind,
  dest: readonly [number, number, number],
  size: readonly [number, number, number],
  data: ArrayBufferView,
): boolean {
  const gl = renderer.getContext() as WebGL2RenderingContext;

  let props = renderer.properties.get(texture) as { __webglTexture?: WebGLTexture };
  if (!props.__webglTexture) {
    // Force allocation before the first draw ever samples the texture.
    renderer.initTexture(texture);
    props = renderer.properties.get(texture) as { __webglTexture?: WebGLTexture };
    if (!props.__webglTexture) return false;
  }

  const previous = gl.getParameter(gl.TEXTURE_BINDING_3D) as WebGLTexture | null;
  gl.bindTexture(gl.TEXTURE_3D, props.__webglTexture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0);
  gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, 0);
  gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
  gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
  gl.pixelStorei(gl.UNPACK_SKIP_IMAGES, 0);
  // three sets these per 2D-texture upload (e.g. flipY colormap atlases) and
  // leaves them dangling; WebGL2 forbids both for 3D texture uploads. three
  // re-applies them on its own uploads, so forcing them off here is safe.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

  const format =
    kind === "rgba8ui" ? gl.RGBA_INTEGER : gl.RED;
  const type = kind === "r32f" ? gl.FLOAT : gl.UNSIGNED_BYTE;

  gl.texSubImage3D(
    gl.TEXTURE_3D,
    0,
    dest[0],
    dest[1],
    dest[2],
    size[0],
    size[1],
    size[2],
    format,
    type,
    data as ArrayBufferView<ArrayBuffer>,
  );

  gl.bindTexture(gl.TEXTURE_3D, previous);
  return true;
}
