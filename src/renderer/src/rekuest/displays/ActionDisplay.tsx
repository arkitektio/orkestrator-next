import { DisplayWidgetProps } from "@/lib/display/registry";
import { RekuestAction } from "@/linkers";
import { useDetailActionQuery } from "../api/graphql";

export const ActionDisplay = (props: DisplayWidgetProps) => {
  const { data } = useDetailActionQuery({
    variables: {
      id: props.object,
    },
  });

  if (!data?.action) return null;

  return (
    <RekuestAction.DetailLink object={data.action}>
      <p className="text-xl">{data.action.name}</p>
      <p className="text-sm">{data.action.description}</p>
    </RekuestAction.DetailLink>
  );
};
