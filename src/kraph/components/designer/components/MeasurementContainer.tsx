import { useEdges, useNodes } from "@xyflow/react";

export const MeasurementContainer = (props: {
    self: string;
}) => {

    const measurements = useEdges().filter((n) => n.target === props.self && n.source === props.self);

    return (
        <div className="text-xs flex flex-col w-ful">
            {measurements.map((m) => (
                <div className="text-xs font-light">
                    {m.id} {m.data?.kind}
                </div>))}
        </div>
    )
}