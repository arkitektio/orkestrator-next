import { useEdges } from "@xyflow/react";
import { MyEdge } from "../types";

export const MeasurementContainer = (props: {
  self: string;
}) => {

  const measurements = useEdges<MyEdge>().filter((n) => n.target === props.self && n.source === props.self);

  return (
    <div className="text-xs flex flex-col w-ful">
      {measurements.map((m) => (
        <div className="text-xs font-light">
          {m.id} {m.data && "label" in m.data ? m.data.label : undefined}
        </div>))}
    </div>
  )
}
