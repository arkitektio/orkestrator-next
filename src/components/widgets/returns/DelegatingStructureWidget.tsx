import { useGetPodQuery } from "@/kabinet/api/graphql";
import { KabinetPod, MikroImage, RekuestNode } from "@/linkers";
import { useGetImageQuery } from "@/mikro-next/api/graphql";
import { RGBD } from "@/mikro-next/components/render/TwoDThree";
import { useDetailNodeQuery } from "@/rekuest/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { RenderedPlotWidget } from "@/widgets/RenderedPlotWidget";
import { StreamWidget } from "@/widgets/StreamWidget";

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
        {defaultContext && <RGBD context={defaultContext} rois={[]} />}
      </div>
    </MikroImage.DetailLink>
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
    return <div> null</div>;
  }
  switch (props.port.identifier) {
    case "@mikro/image":
      return <ImageWidget {...props} />;
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
