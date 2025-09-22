import { useDisplayComponent } from "@/app/display";
import ExperimentWidget from "@/elektro/widgets/ExperimentWidget";
import NeuronModelWidget from "@/elektro/widgets/NeuronModelWidget";
import SimulationWidget from "@/elektro/widgets/SimulationWidget";
import { useGetPodQuery } from "@/kabinet/api/graphql";
import GraphWidget from "@/kraph/widgets/GraphWidget";
import { KabinetPod, MikroImage, MikroROI, RekuestAction } from "@/linkers";
import { UserAvatar } from "@/lok-next/components/UserAvatar";
import { StreamWidget } from "@/lovekit/widgets/StreamWidget";
import { useGetImageQuery, useGetRoiQuery } from "@/mikro-next/api/graphql";
import { FinalRender } from "@/mikro-next/components/render/FInalRender";
import { useDetailActionQuery } from "@/rekuest/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { MeshWidget } from "@/widgets/MeshWidget";
import Timestamp from "react-timestamp";

export const DelegatingStructureWidget = (props: ReturnWidgetProps) => {
  if (!props.value) {
    return (
      <div className="text-xs"> No Value received {props.port.identifier}</div>
    );
  }

  const Widget = useDisplayComponent(props.port.identifier);

  return (
    <Widget
      object={props.value}
      small={true}
      identifier={props.port.identifier}
    />
  );

  switch (props.port.identifier) {
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
