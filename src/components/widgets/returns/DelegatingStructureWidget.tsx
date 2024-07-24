import { useDetailRoomQuery, useGetStreamQuery } from "@/lok-next/api/graphql";
import { useGetImageQuery } from "@/mikro-next/api/graphql";
import { RGBD } from "@/mikro-next/components/render/TwoDThree";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { StreamWidget } from "@/widgets/StreamWidget";

export const ImageWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetImageQuery({
    variables: {
      id: props.value,
    },
  });

  const defaultContext = data?.image?.rgbContexts.at(0);

  return (
    <div className="w-[200px] h-[200px]">
      {defaultContext && <RGBD context={defaultContext} rois={[]} />}
    </div>
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
