import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

type ImageTileProps = {
  textureUrl: string;
  position: [number, number, number];
  scale: number;
};

function ImageTile({ textureUrl, position, scale }: ImageTileProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (loadedTexture) => setTexture(loadedTexture));
  }, [textureUrl]);

  if (!texture) return null;

  return (
    <mesh position={position} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

type ImageLevel = {
  textureUrl: string;
  position: [number, number, number];
  scale: number;
  minZoom: number;
  maxZoom: number;
};

type ImagePyramidProps = {
  images: ImageLevel[];
};

function ImagePyramid({ images }: ImagePyramidProps) {
  const { camera } = useThree();
  const [visibleTiles, setVisibleTiles] = useState<ImageLevel[]>([]);

  useEffect(() => {
    const handleZoom = () => {
      const zoomLevel = camera.position.z;
      const selectedTiles = images.filter(
        (img) => zoomLevel >= img.minZoom && zoomLevel <= img.maxZoom,
      );
      setVisibleTiles(selectedTiles);
    };

    handleZoom();
    camera.addEventListener("change", handleZoom);

    return () => camera.removeEventListener("change", handleZoom);
  }, [camera, images]);

  return (
    <>
      {visibleTiles.map((tile, index) => (
        <ImageTile
          key={index}
          textureUrl={tile.textureUrl}
          position={tile.position}
          scale={tile.scale}
        />
      ))}
    </>
  );
}

type PyramidalImageRenderProps = {
  baseUrl: string;
  levels: number;
};

function generateImageLevels(
  baseUrl: string,
  levels: number = 5,
): ImageLevel[] {
  return useMemo(() => {
    const textures: ImageLevel[] = [];
    for (let i = 0; i < levels; i++) {
      const scale = Math.pow(2, i);
      textures.push({
        textureUrl: `${baseUrl}/level_${i}.jpg`,
        position: [0, 0, 0],
        scale,
        minZoom: i * 2,
        maxZoom: (i + 1) * 2,
      });
    }
    return textures;
  }, [baseUrl, levels]);
}

export default function PyramidalImageRender({
  baseUrl,
  levels,
}: PyramidalImageRenderProps) {
  const imageLevels = generateImageLevels(baseUrl, levels);
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ImagePyramid images={imageLevels} />
    </Canvas>
  );
}
