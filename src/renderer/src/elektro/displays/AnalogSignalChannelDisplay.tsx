import { DisplayWidgetProps } from "@/lib/display/registry";
import { useDetailAnalogSignalChannelQuery } from "../api/graphql";
import { AnalogSignalRender } from "../components/AnalogSignalRender";

export const AnalogSignalChannelDisplay = (props: DisplayWidgetProps) => {
  const { data } = useDetailAnalogSignalChannelQuery({
    variables: {
      id: props.object,
    },
  });

  const roi = data?.analogSignalChannel;
  if (!roi) {
    return <div>ROI not found</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center p-2">
      {data.analogSignalChannel.name}
      in {data.analogSignalChannel.signal.name}
    </div>
  );
};
