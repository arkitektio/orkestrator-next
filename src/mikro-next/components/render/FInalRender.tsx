import { useCursor } from "@react-three/drei";

import { MikroROI } from "@/linkers";
import {
  ColorMap,
  ListRgbContextFragment,
  ListRoiFragment,
  RgbImageFragment,
  RgbViewFragment
} from "@/mikro-next/api/graphql";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { Dispatch, SetStateAction, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { additiveBlending, viewHasher } from "./TwoDRGBRender";
import { blueColormap, createColormapTexture, greenColormap, redColormap, viridisColormap } from "./final/colormaps";
import { useArray } from "./final/useArray";
import { useAsyncChunk } from "./final/useChunkTexture";
import { useViewRenderFunction } from "./hooks/useViewRender";
import { BasicIndexer, IndexerProjection, Slice } from "./indexer";



export interface RGBDProps {
  context: ListRgbContextFragment;
  rois: ListRoiFragment[];
  className?: string;
  follow?: "width" | "height";
  onValueClick?: (value: number) => void;
}

export type PassThroughProps = {
  setOpenPanels: Dispatch<SetStateAction<Panel[]>>;
};

export interface Panel {
  identifier: string;
  object: string;
  positionX: number;
  positionY: number;
}

function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}


export const calculateChunkGrid = (selection: (number | Slice | null)[], shape, chunks) => {
  let indexer = new BasicIndexer({
		selection,
		shape: shape,
		chunk_shape: chunks,
	});

  let chunk_loaders: { chunk_coords: number[], mapping: IndexerProjection[] }[] = [];

  for (const { chunk_coords, mapping,  } of indexer) {
		chunk_loaders.push({ chunk_coords, mapping });

      
		};
  
	

  return chunk_loaders;

}



const useAsyncTexture = (context: ListRgbContextFragment) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { renderView } = useViewRenderFunction();

  const calculateImageData = async (signal: AbortSignal) => {
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





export const useImageDimensions = (
  context: ListRgbContextFragment,
): [number, number, number] => {
  const width = context.image.store?.shape?.at(3);
  const height = context.image.store?.shape?.at(4);
  const depth = context.image.store?.shape?.at(2);
  if (width === undefined || height === undefined || depth === undefined) {
    return [1, 1, 1];
  }

  return [width, height, depth];
};

export const useAspectRatio = (context: ListRgbContextFragment) => {
  const width = context.image.store?.shape?.at(3);
  const height = context.image.store?.shape?.at(4);
  if (width === undefined || height === undefined) {
    return 1;
  }

  return width / height;
};

const convertToThreeJSCoords = (
  vertices: [number, number, number, number, number][],
  imageWidth: number,
  imageHeight: number,
): [number, number][] => {
  console.log(vertices);
  let tr = vertices.map((v) => {
    console.log(v);
    let [c, t, z, x, y] = v;
    return [
      (x / imageWidth) * 2 - 1, // Convert x to range [-1, 1]
      -(y / imageHeight) * 2 + 1, // Convert y to range [-1, 1] and invert
    ] as [number, number];
  });
  console.log(tr);
  return tr;
};

export const converToImagePlaneCoords = (
  vertices: [number, number],
  imageWidth: number,
  imageHeight: number,
): [number, number] => {
  return [
    (vertices[0] / imageWidth) * 2 - 1,
    -(vertices[1] / imageHeight) * 2 + 1,
  ];
};

interface ROIPolygonProps {
  vertices: [number, number][];
}

interface ROIPolygonProps {
  vertices: [number, number][];
}

const ROIPolygon = (
  props: {
    roi: ListRoiFragment;
    width: number;
    height: number;
  } & PassThroughProps,
) => {
  const { roi, width, height } = props;
  const navigate = useNavigate();

  const { camera, gl } = useThree(); // Get the camera and WebGL renderer
  const [hovered, setHovered] = useState(false);
  const popoverRef = useRef(null); // Ref for popover content

  // Convert ROI vectors to Three.js coordinates
  const vertices = convertToThreeJSCoords(roi.vectors, width, height);

  // Create shape from vertices
  const shape = new THREE.Shape();
  shape.moveTo(vertices[0][0], vertices[0][1]);
  vertices.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.lineTo(vertices[0][0], vertices[0][1]); // Close the shape

  const onClick = (e) => {
    const vector = new THREE.Vector3(
      rightCenter.x,
      rightCenter.y,
      rightCenter.z,
    );
    vector.project(camera); // Project the 3D position onto the 2D screen

    // Convert to 2D screen space (pixels)
    const x = (vector.x * 0.5 + 0.5) * gl.domElement.clientWidth;
    const y = -(vector.y * 0.5 - 0.5) * gl.domElement.clientHeight;

    props.setOpenPanels((panels) => {
      if (
        panels.find(
          (x) => x.object === roi.id && x.identifier === MikroROI.identifier,
        )
      ) {
        return panels.filter(
          (x) => x.object !== roi.id && x.identifier !== MikroROI.identifier,
        );
      } else {
        return [
          ...panels,
          {
            positionX: x,
            positionY: y,
            identifier: MikroROI.identifier,
            object: roi.id,
          },
        ];
      }
    });
  };

  // Handle hover states and bounding box calculations
  useCursor(hovered, "pointer");
  const boundingBox = new THREE.Box2().setFromPoints(shape.getPoints());
  const offset = 0.001;
  const topCenter = new THREE.Vector3(
    (boundingBox.min.x + boundingBox.max.x) / 2,
    boundingBox.max.y + offset,
    0.1,
  );
  const rightCenter = new THREE.Vector3(
    boundingBox.max.x + offset,
    (boundingBox.min.y + boundingBox.max.y) / 2,
    0.1,
  );

  return (
    <>
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          color={"white"}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={hovered ? 0.5 : 0.2}
          depthWrite={false}
        />
      </mesh>
      <line>
        <shapeGeometry args={[shape]} />
        <lineBasicMaterial color="black" linewidth={1} />
      </line>
    </>
  );
};


export const AutoZoomCamera = (props: PassThroughProps) => {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);

  useFrame(({ size }) => {
    if (cameraRef.current) {
      const aspect = size.width / size.height;
      cameraRef.current.left = -aspect;
      cameraRef.current.right = aspect;
      cameraRef.current.top = 1;
      cameraRef.current.bottom = -1;
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return (
    <OrthographicCamera
      ref={cameraRef}
      position={[0, 0, 5]}
      near={0.1}
      far={1000}
      makeDefault
    />
  );
};

const colorMapOptions = Object.values(ColorMap).map((x) => ({
  value: x,
  label: x,
}));


const getColormapForView = (view: RgbViewFragment) => {
  switch ( view.colorMap) {
  case ColorMap.Blue: {
    return blueColormap;
  }
  case ColorMap.Green: {
    return greenColormap;
  }
  case ColorMap.Red: {
    return redColormap;
  }
  case ColorMap.Intensity: {
    return createColormapTexture(
      Array.from({ length: 256 }, (_, i) => [(view.baseColor?.at(0) || 0) * i, (view.baseColor?.at(1) || 0) * i, (view.baseColor?.at(2) || 0) * i] )
    );
  }


  default: {
    return viridisColormap;
  }
  }
};


export const ChunkBitmapTexture = ({
  renderFunc,
  chunk_coords,
  chunk_shape,
  view,
  z,
  t,
}: {
  renderFunc: any,
  chunk_coords: number[],
  chunk_shape: number[],
  view: RgbViewFragment,
  z: number,
  t: number,
}) => {
  const texture = useAsyncChunk({
    renderFunc,
    chunk_coords,
    chunk_shape,
    c: view.cMin || 0,
    z: z,
    t: t,
  });

  const colormapTexture = getColormapForView(view);



  const box_shape_3d = chunk_shape?.slice(3, 5);
  const box_shape = [box_shape_3d[0], box_shape_3d[1], 1];
  const box_position_3d = chunk_coords.slice(3, 5);
  const box_position = [box_position_3d[0] * box_shape[0], box_position_3d[1] * box_shape[1], 0];

  return (
    <mesh position={[
      box_position[1],
      box_position[0],
      box_position[2]
    ]}>
      <planeGeometry args={[box_shape[1], box_shape[0]]} />
      {texture && colormapTexture  ? <shaderMaterial
      transparent={true}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      uniforms={{
      colorTexture: { value: texture.texture },
      colormapTexture: { value: colormapTexture },
      minValue: { value: texture.min },
      maxValue: { value: texture.max },
      opacity: { value: 0 } // Add opacity uniform
      }}
      onBeforeCompile={(shader) => {
      // Animate opacity from 0 to 1
      let startTime = Date.now();
      const animate = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        shader.uniforms.opacity.value = Math.min(elapsedTime, 1);
        if (elapsedTime < 1) requestAnimationFrame(animate);
      };
      animate();
      }}
      vertexShader={`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `}
      fragmentShader={`
      uniform sampler2D colorTexture;
      uniform sampler2D colormapTexture;
      uniform float minValue;
      uniform float maxValue;
      uniform float opacity;
      varying vec2 vUv;

      void main() {
        float value = texture2D(colorTexture, vUv).r;
        float normalized = (value - minValue) / (maxValue - minValue);
        vec4 color = texture2D(colormapTexture, vec2(clamp(normalized, 0.0, 1.0), 0.5)).rgba;
        gl_FragColor = vec4(color.rgb, color.a * opacity); // Apply opacity
      }
      `}
      />:
      
      <meshBasicMaterial
      color={"black"} />
      }
    </mesh>
  );
};

export const FinalRender = (props: RGBDProps) => {
  const [openPanels, setOpenPanels] = useState<Panel[]>([]);

  const [z, setZ] = useState(0);
  const [t, setT] = useState(0);

  const version = props.context.image.store.version;
  const zSize = props.context.image.store.shape.at(2) || 1;
  const tSize = props.context.image.store.shape.at(1) || 1;
  const cSize = props.context.image.store.shape.at(0) || 1;

  if (props.context.image.store.chunks?.length != props.context.image.store.shape.length) {
    return <div>This new chunk loader needs chunks to be present. update mikro </div>;
  }


  if (version != "3") {
    return <div>Rendering not implemented for Zarr Version other than 3</div>;
  }

  console.log("Views", props.context.views);


  
  // Calculate which chunks are needed for the view

  const { renderView } = useArray({
    store: props.context.image.store,
  })


  const chunk_shape = props.context.image.store.chunks;

  if (!chunk_shape) {
    return <div>Chunk shape not found</div>
  }

 


  return (

    <div style={{ width: "100%", height: "100%" }} className="relative">
      <div className="absolute top-0 right-0 z-10">
        <div className="flex flex-col">
          <div className="flex flex-row">
            {z > 0 && <button
              onClick={() => setZ((z) => Math.max(z - 1, 0))}
              className="bg-blue-500 text-white"
            >
              - z
            </button>}
            {z < (zSize-1) &&<button
              onClick={() => setZ((z) => z + 1)}
              className="bg-blue-500 text-white"
            >
              + z
            </button>}
          </div>
          <div className="flex flex-row">
            {t > 0 && <button
              onClick={() => setT((t) => Math.max(t - 1, 0))}
              className="bg-blue-500 text-white"
            >
              - z
            </button>}
            {t < (tSize-1) && <button
              onClick={() => setT((t) => t + 1)}
              className="bg-blue-500 text-white"
            >
              + T
            </button>}
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="w-full h-full bg-gray-100"> Loading</div>}>
      <Canvas style={{ width: "100%", height: "100%" }}>
        <AutoZoomCamera setOpenPanels={setOpenPanels} />
        <OrbitControls enableRotate={false} enablePan={true} regress={false} />
        {props.context.views.map((view, index) => {

          const selection = [{start: view.cMin, stop: view.cMax, step: null}, t, z, {start: null, stop: null, step: null}, {start: null, stop: null, step: null} ];
        
          const chunk_loaders = calculateChunkGrid(selection, props.context.image.store.shape, chunk_shape);

          
          return <group scale={[
                2/props.context.image.store.shape[3],
                -2/props.context.image.store.shape[4],
                1
              ]}>
          {chunk_loaders.map((chunk_loader, index) => {

            return <ChunkBitmapTexture renderFunc={renderView} chunk_coords={chunk_loader.chunk_coords} chunk_shape={chunk_shape} key={`${index}-${z}-${t}`} view={view} t={t} z={z}/>
          })}
          </group>
          }
        )}
      </Canvas>
      </Suspense>

    </div>
  );
};

export const ImageRGBD = (props: { image: RgbImageFragment }) => {
  const context = props.image.rgbContexts.at(0);

  return <>{context && <RGBD context={context} rois={[]} />}</>;
};

