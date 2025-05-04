import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { KraphNode } from "@/linkers";
import { PortKind } from "@/rekuest/api/graphql";
import { useGetNodeQuery } from "../api/graphql";

export const EntityOverlay = (props: { entity: string }) => {
  const { data } = useGetNodeQuery({
    variables: {
      id: props.entity,
    },
  });

  return (
    <div>
      <KraphNode.DetailLink object={props.entity}>
        {data?.node?.label}
      </KraphNode.DetailLink>

      {data?.node?.__typename == "Structure" && (
        <>
          {data?.node?.object && data?.node.identifier && (
            <>
              <DelegatingStructureWidget
                port={{
                  kind: PortKind.Structure,
                  identifier: data.node.identifier,
                  key: data.node.object,
                  __typename: "Port",
                  nullable: false,
                }}
                value={data.node.object}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
