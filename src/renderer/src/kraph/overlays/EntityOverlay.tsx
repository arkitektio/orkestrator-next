import { KraphInstance } from "@/linkers";
import { useGetInstanceQuery } from "../api/graphql";

/**
 * Names a claim by its word, from a bare id.
 *
 * The `__typename === "Structure"` branch this used to carry is gone with the
 * schema: `Structure` implements no node interface any more — it is a row of a
 * different table, pointing at an external datum, never drawn as a vertex. A
 * structure reached from here is `structure(id:)`, not a node.
 */
export const EntityOverlay = (props: { entity: string }) => {
  const { data } = useGetInstanceQuery({ variables: { id: props.entity } });

  return (
    <div>
      <KraphInstance.DetailLink object={{ id: props.entity }}>
        {data?.instance?.term.label ?? data?.instance?.term.key}
      </KraphInstance.DetailLink>
    </div>
  );
};
