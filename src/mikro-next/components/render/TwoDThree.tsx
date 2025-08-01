import { ChoicesField } from "@/components/fields/ChoicesField";
import { SliderField } from "@/components/fields/SliderField";
import { SwitchField } from "@/components/fields/SwitchField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text, useCursor } from "@react-three/drei";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { cn } from "@/lib/utils";
import { MikroROI } from "@/linkers";
import {
  ColorMap,
  ListRgbContextFragment,
  ListRoiFragment,
  RgbImageFragment,
  RoiFragment,
  useCreateRgbContextMutation,
  useUpdateRgbContextMutation,
} from "@/mikro-next/api/graphql";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { additiveBlending, bitmapToBlob, viewHasher } from "./TwoDRGBRender";
import { useViewRenderFunction } from "./hooks/useViewRender";
import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { PortKind } from "@/rekuest/api/graphql";

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
  isRightClick?: boolean;
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

const ImageBitmapTextureMesh = ({
  context,
  rois,
  setOpenPanels,
  onValueClick,
}: RGBDProps & PassThroughProps) => {
  const texture = useAsyncTexture(context);

  const [width, height, depth] = useImageDimensions(context);

  if (!texture) return null;
  if (!texture) return null;
  return (
    <group>
      <mesh
        rotation={[0, 0, Math.PI]}
        onClick={(e) => {
          setOpenPanels([]);
        }}
      >
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {rois.map((roi) => (
        <ROIPolygon
          roi={roi}
          width={width}
          height={height}
          setOpenPanels={setOpenPanels}
        />
      ))}
    </group>
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

export const RGBD = (props: RGBDProps) => {
  const [openPanels, setOpenPanels] = useState<Panel[]>([]);

  const version = props.context.image.store.version;

  if (version != "3") {
    return <div>Rendering not implemented for Zarr Version other than 3</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <Canvas style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={1} />
        <AutoZoomCamera setOpenPanels={setOpenPanels} />
        <OrbitControls enableRotate={false} enablePan={true} regress={false} />
        <ImageBitmapTextureMesh
          {...props}
          setOpenPanels={setOpenPanels}
          onValueClick={props.onValueClick}
        />
      </Canvas>
      {openPanels.map((panel) => (
        <Card
          style={{
            position: "absolute",
            top: `${panel.positionY}px`,
            left: `${panel.positionX}px`,
            zIndex: 10,
          }}
          className="p-2"
        >
          <DelegatingStructureWidget
            port={{
              key: "x",
              nullable: false,
              kind: PortKind.Structure,
              identifier: panel.identifier,
              __typename: "Port",
            }}
            value={panel.object}
          />
        </Card>
      ))}
    </div>
  );
};

export const ImageRGBD = (props: { image: RgbImageFragment }) => {
  const context = props.image.rgbContexts.at(0);

  return <>{context && <RGBD context={context} rois={[]} />}</>;
};

export const RoiRGBD = (props: { roi: RoiFragment }) => {
  const context = props.roi.image.rgbContexts.at(0);

  return <>{context && <RGBD context={context} rois={[props.roi]} />}</>;
};

export const TwoDRGBThreeRenderDetail = ({
  context,
  rois,
  className,
  follow = "width",
}: RGBDProps) => {
  const causeUpload = useMediaUpload();

  const [create, _] = useCreateRgbContextMutation();
  const [update, _d] = useUpdateRgbContextMutation();

  const myform = useForm<ListRgbContextFragment>({
    defaultValues: context,
  });

  const { register, control, handleSubmit, watch, formState } = myform;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "views", // unique name for your Field Array
    },
  );

  const { renderView } = useViewRenderFunction();

  const calculateImageData = async (data: ListRgbContextFragment) => {
    // Sequentially render each view to ensure proper blending

    // Fetch all ImageData objects for the views
    const imageDataArray = await Promise.all(
      data.views
        .filter((v) => v.active)
        .map((view) => renderView(view, data.t, data.z)),
    );

    // Additively blend the ImageData objects
    if (imageDataArray.length === 0) {
      throw new Error("No views active");
    }
    const blendedImageData = additiveBlending(imageDataArray);
    let bitmap = await createImageBitmap(blendedImageData);
    return bitmap;
  };

  const createNewView = async (data: ListRgbContextFragment) => {
    const imageData = await calculateImageData(data);
    if (!imageData) {
      return;
    }

    const blob = await bitmapToBlob(imageData);
    const file = new File([blob], `context-${context.image.id}-thumbnail.png`, {
      type: "image/png",
    });

    let thumbnail = await causeUpload(file);

    create({
      variables: {
        input: {
          name: "New View",
          image: context.image.id,
          thumbnail: thumbnail,
          views: data.views.map((view) => {
            return {
              colorMap: view.colorMap,
              cMax: view.cMax || 1,
              cMin: view.cMin || 0,
              active: view.active,
              rescale: view.rescale,
            };
          }),
        },
      },
    });
  };

  const updateView = async (data: ListRgbContextFragment) => {
    if (data.image.store.version != "2") {
      return;
    }

    const imageData = await calculateImageData(data);
    if (!imageData) {
      return;
    }

    const blob = await bitmapToBlob(imageData);
    const file = new File([blob], `context-${context.image.id}-thumbnail.png`, {
      type: "image/png",
    });

    let thumbnail = await causeUpload(file);

    update({
      variables: {
        input: {
          id: context.id,
          thumbnail: thumbnail,
          views: data.views.map((view) => {
            return {
              colorMap: view.colorMap,
              cMax: view.cMax || 1,
              cMin: view.cMin || 0,
              active: view.active,
              rescale: view.rescale,
              baseColor: view.baseColor,
            };
          }),
        },
      },
    });
  };

  const onSubmit = (data: ListRgbContextFragment) => {
    console.log("Submitting", data);
    createNewView(data);
  };

  const data = watch();

  const image = context.image;
  let cSize = image.store.shape?.at(0) || 0;
  let zSize = image.store.shape?.at(2) || 0;
  let tSize = image.store.shape?.at(1) || 0;
  const cArray = new Array(cSize).fill(0);
  console.log(zSize, tSize, cSize, context);

  console.log("Available images", data);

  return (
    <div>
      <Form {...myform}>
        <div className="flex flex-row w-full h-full p-3 gap-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex h-full w-full"
          >
            <div className="flex-initial p-3 flex flex-col justify-between h-full gap-1r">
              <Card className="flex-initial p-3 flex flex-col gap-1 bg-black  border-gray-800 border">
                {zSize > 1 && (
                  <SliderField
                    name={`z`}
                    label="Z"
                    min={0}
                    max={zSize - 1}
                    throttle={1000}
                  />
                )}
                {tSize > 1 && (
                  <SliderField
                    name={`t`}
                    label="T"
                    min={0}
                    max={tSize}
                    throttle={1000}
                  />
                )}
                <div className="flex flex-col gap-1 h-full">
                  {fields.map((field, index) => {
                    let active = watch(`views.${index}.active`);
                    let map = watch(`views.${index}.baseColor`);

                    return (
                      <Card
                        key={field.id}
                        className="flex-initial p-3 data-[active=false]:opacity-50 opacity-100 transition-opacity flex flex-row gap-2 group relative bg-black border-gray-800 border"
                        data-active={active}
                      >
                        <div className="flex flex-col gap-2 w-full">
                          <ChoicesField
                            name={`views.${index}.colorMap`}
                            options={colorMapOptions}
                            label="Color Map"
                          />
                          <div className="flex flex-row gap-2 w-full">
                            <SwitchField
                              name={`views.${index}.active`}
                              label="Active"
                              className="flex-1"
                            />
                            <SwitchField
                              name={`views.${index}.rescale`}
                              label="Rescale"
                              className="flex-1"
                            />
                          </div>
                          {JSON.stringify(map)}
                          <div className="">
                            <Button
                              onClick={() => remove(index)}
                              variant={"outline"}
                              size={"icon"}
                              className="h-full text-white "
                              disabled={fields.length === 1}
                            >
                              <X className="w-8" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"outline"}>
                        <Plus />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {cArray.map((x, i) => (
                        <DropdownMenuItem
                          onSelect={() => {
                            append({
                              id: "FAKE_ID",
                              colorMap: ColorMap.Viridis,
                              cMax: i + 1,
                              cMin: i,
                              active: true,
                              rescale: false,
                              image: image,
                              fullColour: "rgb(0,0,0)",
                            });
                          }}
                        >
                          Render Channel {i}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex-grow"></div>
                </div>
              </Card>
              <div className="flex gap-2 w-full text-white">
                <Button type="submit" variant={"outline"} className="flex-1 m">
                  <Plus className="mr-2" /> New
                </Button>
                <Button
                  onClick={() => updateView(data)}
                  variant={"outline"}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </div>

            <div
              className={cn(
                "flex-1 w-full overflow-hidden border-1 rounded rounded-md border-gray-800 border m-3 p-3",
                className,
              )}
            >
              <RGBD context={data} rois={rois} />
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};
