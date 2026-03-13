import { DisplayWidgetProps } from "@/lib/display/registry";
import { RekuestAction } from "@/linkers";
import { useDetailActionQuery } from "../api/graphql";

export const ActionDisplay = (props: DisplayWidgetProps) => {
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
