import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { useForm } from "react-hook-form";
import {
  ScanDirection,
  useCreateContinousScanViewMutation,
} from "../api/graphql";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const calculateIndex = (
  currentIndex: number,
  gridSize: number,
  directionPattern: ScanDirection,
) => {
  switch (directionPattern) {
    case ScanDirection.ColumnRowSlice:
      const z1 = Math.floor(currentIndex / (gridSize * gridSize));
      const y1 = Math.floor(
        (currentIndex - z1 * gridSize * gridSize) / gridSize,
      );
      const x1 = currentIndex - z1 * gridSize * gridSize - y1 * gridSize;
      return x1 * gridSize * gridSize + y1 * gridSize + z1;

    case ScanDirection.ColumnRowSliceSnake:
      const z2 = Math.floor(currentIndex / (gridSize * gridSize));
      const x2 = Math.floor(
        (currentIndex - z2 * gridSize * gridSize) / gridSize,
      );
      const y2 = currentIndex - z2 * gridSize * gridSize - x2 * gridSize;
      return x2 * gridSize * gridSize + y2 * gridSize + z2;

    case ScanDirection.RowColumnSlice:
      // Define the snake pattern logic here
      return currentIndex;

    default:
      return currentIndex;
  }
};

function PixelatedCube({
  gridSize = 14,
  cubeSize = 0.9,
  speed = 10,
  directionPattern = ScanDirection.ColumnRowSlice,
}) {
  const materialsRef = useRef([]);
  const currentIndex = useRef(0);
  const lightRef = useRef();

  useFrame((state, delta) => {
    const cubesToUpdate = speed * delta;

    let lastUpdatedIndex = -1;
    for (let i = 0; i < cubesToUpdate; i++) {
      const calculatedIndex = calculateIndex(
        currentIndex.current,
        gridSize,
        directionPattern,
      );
      const material = materialsRef.current[calculatedIndex];

      if (material) {
        material.emissive.set("yellow");
        material.needsUpdate = true;
        lastUpdatedIndex = calculatedIndex;
      }

      currentIndex.current++;
    }
  });

  const cubes = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const index = x * gridSize * gridSize + y * gridSize + z;
        cubes.push(
          <mesh
            key={`mesh-${x}-${y}-${z}`}
            position={[x - gridSize / 2, y - gridSize / 2, z - gridSize / 2]}
          >
            <boxGeometry
              attach="geometry"
              args={[cubeSize, cubeSize, cubeSize]}
            />
            <meshStandardMaterial
              ref={(material) => {
                materialsRef.current[index] = material;
              }}
              attach="material"
              color="gray"
              transparent
              opacity={0.3}
            />
          </mesh>,
        );
      }
    }
  }

  return (
    <>
      {cubes}
      <pointLight ref={lightRef} color="yellow" distance={5} intensity={1} />
    </>
  );
}

export const AddContinousScanViewForm = (props: { image: string }) => {
  const [add] = withMikroNext(useCreateContinousScanViewMutation)();

  const dialog = useGraphQlFormDialog(add);

  const form = useForm({
    defaultValues: {
      direction: ScanDirection.ColumnRowSlice,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                input: { image: props.image, ...data },
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <div id="canvas-container w-[100px] h-[100px]">
              <Canvas camera={{ position: [20, 20, 20] }}>
                <ambientLight intensity={0.1} />
                <directionalLight color="white" position={[0, 0, 5]} />
                <PixelatedCube />
                <OrbitControls />
              </Canvas>
            </div>

            <div className="col-span-2">
              <ChoicesField
                options={Object.values(ScanDirection).map((v) => ({
                  label: v.toLowerCase(),
                  value: v,
                }))}
                name="direction"
                label="Direction"
                description="Which direction should the scan be?"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
