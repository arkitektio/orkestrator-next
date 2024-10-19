import { useEffect, useState } from "react";
import { RGBDProps, viewHasher } from "../TwoDRGBRender";
import { PassThroughProps, useImageDimensions } from "../TwoDThree";
import { use2DViewGridProjector } from "./useViewChunks";
import { ChunkProjection } from "zarr/types/core/types";

const useAsyncTexture = (context: ListRgbContextFragment) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { renderView } = useViewRenderFunction();

  const calculateChunks = async (signal: AbortSignal) => {
    // Sequentially render each view to ensure proper blending

    // Fetch all ImageData objects for the views
    const imageDataArray = await Promise.all(
      context.views
        .filter((v) => v.active)
        .map((view) => renderView(view, context.t, context.z, signal)),
    );

    // Additively blend the ImageData objects
    if (imageDataArray.length === 0) {
      return;
    }
    const blendedImageData = additiveBlending(imageDataArray);
    let bitmap = await createImageBitmap(blendedImageData);
    const texture = new THREE.Texture(bitmap);
    texture.needsUpdate = true;
    setTexture(texture);
  };

  useEffect(() => {
    let abortController = new AbortController();
    calculateImageData(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [context.views.map(viewHasher).join("-"), context.z, context.t]);

  return texture;
};

export const ChunkedImage = ({
  context,
  setOpenPanels,
}: RGBDProps & PassThroughProps) => {
  const project = use2DViewGridProjector();
  const [projections, setProjections] = useState<ChunkProjection[][]>([]);

  const calculateChunks = async (signal: AbortSignal) => {
    // Sequentially render each view to ensure proper blending

    // Fetch all ImageData objects for the views
    try {
      const projections = await Promise.all(
        context.views
          .filter((v) => v.active)
          .map((view) => project(view, context.t, context.z, signal)),
      );

      setProjections(projections);
      console.log("Projections", projections);
    } catch (e) {
      console.error("Projections", e);
    }
  };

  useEffect(() => {
    let abortController = new AbortController();
    calculateChunks(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [context.views.map(viewHasher).join("-"), context.z, context.t]);

  return (
    <group>
      <mesh rotation={[0, 0, Math.PI]} onClick={() => setOpenPanels([])}>
        <planeGeometry args={[2, 2]} />
      </mesh>
    </group>
  );
};
