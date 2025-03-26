import { useGetPodQuery } from "@/kabinet/api/graphql";
import GraphViewWidget from "@/kraph/widgets/GraphViewWidget";
import OntologyWidget from "@/kraph/widgets/OntologyWidget";
import { KabinetPod, MikroImage, MikroROI, RekuestNode } from "@/linkers";
import { UserAvatar } from "@/lok-next/components/UserAvatar";
import { useGetImageQuery, useGetRoiQuery } from "@/mikro-next/api/graphql";
import { DelegatingImageRender } from "@/mikro-next/components/render/DelegatingImageRender";
import { FinalRender } from "@/mikro-next/components/render/FInalRender";
import { RGBD } from "@/mikro-next/components/render/TwoDThree";
import { useDetailNodeQuery } from "@/rekuest/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { MeshWidget } from "@/widgets/MeshWidget";
import { RenderedPlotWidget } from "@/widgets/RenderedPlotWidget";
import { StreamWidget } from "@/widgets/StreamWidget";
import Timestamp from "react-timestamp";

export const ImageWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetImageQuery({
    variables: {
      id: props.value,
    },
  });

  const defaultContext = data?.image?.rgbContexts.at(0);

  return (
    <MikroImage.DetailLink object={props.value}>
      <div className="w-[200px] h-[200px]">
        {defaultContext && <DelegatingImageRender context={defaultContext} rois={[]} />}
      </div>
    </MikroImage.DetailLink>
  );
};

export const RoiWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetRoiQuery({
    variables: {
      id: props.value,
    },
  });

  const defaultContext = data?.roi.image?.rgbContexts.at(0);
  const roi = data?.roi;

  return (
    <MikroROI.DetailLink object={props.value}>
       {roi?.creator && <UserAvatar sub={roi.creator.sub} />}
       {roi?.createdAt && <p>Marked <Timestamp date={roi.createdAt} relative/></p>}
    </MikroROI.DetailLink>
  );
};

export const NodeWidget = (props: ReturnWidgetProps) => {
  const { data } = useDetailNodeQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <RekuestNode.DetailLink object={props.value}>
      <p className="text-xl">{data?.node?.name}</p>
      <p className="text-sm">{data?.node?.description}</p>
    </RekuestNode.DetailLink>
  );
};

export const PodWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetPodQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <KabinetPod.DetailLink object={props.value}>
      <p className="text-xl">
        {data?.pod?.deployment.flavour?.release?.app.identifier}
      </p>
      <p className="text-sm">Deployed on {data?.pod?.backend.name}</p>
    </KabinetPod.DetailLink>
  );
};

export const DelegatingStructureWidget = (props: ReturnWidgetProps) => {
  if (!props.value) {
    return (
      <div className="text-xs"> No Value received {props.port.identifier}</div>
    );
  }
  switch (props.port.identifier) {
    case "@mikro/image":
      return <ImageWidget {...props} />;
    case "@mikro/roi":
      return <RoiWidget {...props} />;
    case "@lok/stream":
      return <StreamWidget {...props} />;
    case "@mikro/renderedplot":
      return <RenderedPlotWidget {...props} />;
    case "@rekuest-next/node":
      return <NodeWidget {...props} />;
    case "@kabinet/pod":
      return <PodWidget {...props} />;
    case "@mikro/snapshot":
      return <div>Snapshssot</div>;
    case "@mikro/mesh":
      return <MeshWidget {...props} />;
    case "@kraph/ontology":
      return <OntologyWidget {...props} />;
    case "@kraph/graphview":
      return <GraphViewWidget {...props} />;

    default:
      return (
        <>
          {" "}
          Unknown Structure {props.port.identifier}
          {JSON.stringify(props.value)}
        </>
      );
  }
};
