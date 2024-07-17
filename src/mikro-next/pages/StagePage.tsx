import { FormSheet } from "@/components/dialog/FormDialog";
import { ListRender } from "@/components/layout/ListRender";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroImage } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { useParams } from "react-router";
import { useGetStageQuery, usePinStageMutation } from "../api/graphql";
import StageTransformationViewCard from "../components/cards/StageTransformationViewCard";
import { PinToggle } from "../components/ui/PinToggle";
import { UpdateStageForm } from "../forms/UpdateStageForm";

export type IRepresentationScreenProps = {};

export const MyBox = ({ x, y, z, width, height, depth }) => {
  const [click, setClick] = React.useState(false);

  return (
    <mesh position={[x, y, z]} onClick={() => setClick(!click)}>
      <boxGeometry args={[width, height, depth]} />
      <meshNormalMaterial wireframe wireframeLinewidth={click ? 1000 : 10} />
    </mesh>
  );
};

const MyCanvasComponent = ({ data }) => {
  // Calculate the bounding environment
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  data?.stage?.affineViews.forEach((view) => {
    let x = view.affineMatrix[0][3];
    let y = view.affineMatrix[1][3];
    let z = view.affineMatrix[2][3];

    let xScale = view.affineMatrix[0][0];
    let yScale = view.affineMatrix[1][1];
    let zScale = view.affineMatrix[2][2];

    let scaledXSize = (view.image.store.shape?.at(4) || 1) * xScale;
    let scaledYSize = (view.image.store.shape?.at(3) || 1) * yScale;
    let scaledZSize = (view.image.store.shape?.at(2) || 1) * zScale;

    minX = Math.min(minX, x - scaledXSize / 2);
    minY = Math.min(minY, y - scaledYSize / 2);
    minZ = Math.min(minZ, z - scaledZSize / 2);

    maxX = Math.max(maxX, x + scaledXSize / 2);
    maxY = Math.max(maxY, y + scaledYSize / 2);
    maxZ = Math.max(maxZ, z + scaledZSize / 2);
  });

  // Calculate the center and size of the bounding box
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;

  const boundingWidth = maxX - minX;
  const boundingHeight = maxY - minY;
  const boundingDepth = maxZ - minZ;

  const maxDimension = Math.max(boundingWidth, boundingHeight, boundingDepth);

  return (
    <Canvas>
      <pointLight position={[10, 10, 10]} />
      {data?.stage?.affineViews.map((view, index) => {
        let x = view.affineMatrix[0][3];
        let y = view.affineMatrix[1][3];
        let z = view.affineMatrix[2][3];

        let xScale = view.affineMatrix[0][0];
        let yScale = view.affineMatrix[1][1];
        let zScale = view.affineMatrix[2][2];

        let scaledXSize = (view.image.store.shape?.at(4) || 1) * xScale;
        let scaledYSize = (view.image.store.shape?.at(3) || 1) * yScale;
        let scaledZSize = (view.image.store.shape?.at(2) || 1) * zScale;

        // Normalize the sizes relative to the max dimension
        const normalizedXSize = (scaledXSize / maxDimension) * boundingWidth;
        const normalizedYSize = (scaledYSize / maxDimension) * boundingHeight;
        const normalizedZSize = (scaledZSize / maxDimension) * boundingDepth;

        // Normalize the positions relative to the bounding box center
        const normalizedX = ((x - centerX) / maxDimension) * boundingWidth;
        const normalizedY = ((y - centerY) / maxDimension) * boundingHeight;
        const normalizedZ = ((z - centerZ) / maxDimension) * boundingDepth;

        return (
          <MyBox
            x={normalizedX}
            y={normalizedY}
            z={normalizedZ}
            width={normalizedXSize}
            height={normalizedYSize}
            depth={normalizedZSize}
          />
        );
      })}
      <OrbitControls />
    </Canvas>
  );
};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const { data, refetch } = useGetStageQuery({
    variables: {
      id: id,
    },
  });

  const [pinStage] = usePinStageMutation();

  return (
    <ModelPageLayout
      actions={<MikroImage.Actions id={id} />}
      identifier="@mikro/image"
      object={id}
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <>
                <PinToggle
                  onPin={(e) => {
                    data?.stage.id;
                  }}
                  pinned={data?.stage?.pinned || false}
                />
                <FormSheet trigger={<HobbyKnifeIcon />}>
                  {data?.stage && <UpdateStageForm stage={data?.stage} />}
                </FormSheet>
              </>
            }
          >
            {data?.stage?.name}
          </DetailPaneTitle>
        </DetailPaneHeader>
        <ListRender array={data?.stage?.affineViews}>
          {(view, index) => (
            <>
              {view.__typename == "AffineTransformationView" && (
                <>
                  <StageTransformationViewCard view={view} key={index} />
                </>
              )}
            </>
          )}
        </ListRender>
      </DetailPane>

      <div className="w-full h-full bg-gray-100">
        <MyCanvasComponent data={data} />
      </div>
    </ModelPageLayout>
  );
};

export default Page;
