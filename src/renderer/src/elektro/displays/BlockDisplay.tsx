import { DisplayWidgetProps } from "@/lib/display/registry";
import { useDetailBlockQuery, useDetailSimulationQuery } from "../api/graphql";

export const BlockDisplay = (props: DisplayWidgetProps) => {
  const { data } = useDetailBlockQuery({
    variables: {
      id: props.object,
    },
  });

  const roi = data?.block;
  if (!roi) {
    return <div>ROI not found</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center p-2">
      {data.block.name}
      in {data.block.name}
    </div>
  );
};
