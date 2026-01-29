import { DisplayWidgetProps } from "@/lib/display/registry";
import { useDetailSimulationQuery } from "../api/graphql";

export const SimulationDisplay = (props: DisplayWidgetProps) => {
  const { data } = useDetailSimulationQuery({
    variables: {
      id: props.object,
    },
  });

  const roi = data?.simulation;
  if (!roi) {
    return <div>ROI not found</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center p-2">
      {data.simulation.name}
      in {data.simulation.name}
    </div>
  );
};
