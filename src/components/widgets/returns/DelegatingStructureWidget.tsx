import ExperimentWidget from "@/elektro/widgets/ExperimentWidget";
import NeuronModelWidget from "@/elektro/widgets/NeuronModelWidget";
import SimulationWidget from "@/elektro/widgets/SimulationWidget";
import { useGetPodQuery } from "@/kabinet/api/graphql";
import GraphWidget from "@/kraph/widgets/GraphWidget";
import { KabinetPod, MikroImage, MikroROI, RekuestAction } from "@/linkers";
import { UserAvatar } from "@/lok-next/components/UserAvatar";
import { StreamWidget } from "@/lovekit/widgets/StreamWidget";
import { useGetImageQuery, useGetRoiQuery } from "@/mikro-next/api/graphql";
import { DelegatingImageRender } from "@/mikro-next/components/render/DelegatingImageRender";
import { useDetailActionQuery } from "@/rekuest/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { MeshWidget } from "@/widgets/MeshWidget";
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
        {defaultContext && (
          <DelegatingImageRender context={defaultContext} rois={[]} />
        )}
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
      {roi?.createdAt && (
        <p>
          Marked <Timestamp date={roi.createdAt} relative />
        </p>
      )}
    </MikroROI.DetailLink>
  );
};

export const NodeWidget = (props: ReturnWidgetProps) => {
  const { data } = useDetailActionQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <RekuestAction.DetailLink object={props.value}>
      <p className="text-xl">{data?.action?.name}</p>
      <p className="text-sm">{data?.action?.description}</p>
    </RekuestAction.DetailLink>
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
    case "@lovekit/stream":
      return <StreamWidget {...props} />;
    case "@rekuest/action":
      return <NodeWidget {...props} />;
    case "@kabinet/pod":
      return <PodWidget {...props} />;
    case "@mikro/snapshot":
      return <div>Snapshssot</div>;
    case "@mikro/mesh":
      return <MeshWidget {...props} />;
    case "@kraph/graph":
      return <GraphWidget {...props} />;
    case "@elektro/experiment":
      return <ExperimentWidget {...props} />;
    case "@elektro/neuronmodel":
      return <NeuronModelWidget {...props} />;
    case "@elektro/simulation":
      return <SimulationWidget {...props} />;
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
