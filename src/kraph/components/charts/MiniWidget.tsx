import { DisplayWidget } from "@/command/Menu";
import { useGetNodeQuery } from "@/kraph/api/graphql";

export const MiniWidget = (props: {
  id: string | undefined;
  graph: string | undefined;
}) => {
  const { data, loading } = useGetNodeQuery({
    variables: { id: `${props.graph}:${props.id}` },
  } as any);

  if (loading) return <div>Loading node…</div>;
  if (!data || !data.node) return <div>No node found</div>;

  if (data.node.__typename === "Structure") {
    return (
      <DisplayWidget
        identifier={data.node.identifier}
        object={data.node.object}
      />
    );
  }

  return <div>{data.node.__typename}</div>;
};
