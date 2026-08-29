import { useGetNodeQuery } from "@/kraph/api/graphql";

/**
 * Names one node of a graph.
 *
 * This used to build `${graph}:${id}` and pass it as a single argument — the
 * `GraphID` scalar, which packed a view and a per-view id into one opaque
 * string. That scalar is gone: ids are bare uuids and the graph is a separate
 * argument, because a claim belongs to the organization and only its *drawing*
 * belongs to a view.
 *
 * The `Structure` branch went with it. `Structure` implements no node interface
 * any more, so a node here is only ever an Entity, a NaturalEvent or a
 * ProtocolEvent.
 */
export const MiniWidget = (props: {
  id: string | undefined;
  graph: string | undefined;
}) => {
  const { data, loading } = useGetNodeQuery({
    variables: { id: props.id ?? "", graph: props.graph ?? "" },
    skip: !props.id || !props.graph,
  });

  if (loading) return <div>Loading node…</div>;
  if (!data || !data.node) return <div>No node found</div>;

  return <div>{data.node.label}</div>;
};
