import { ListRender } from "@/components/layout/ListRender";
import { PortDefinition } from "@/linkers";
import { useListDefinitionsQuery } from "@/port-next/api/graphql";
import { withPort } from "@jhnnsrs/port-next";
import DefinitionCard from "../cards/DefinitionCard";

const List = () => {
  const { data, error, subscribeToMore, refetch } = withPort(
    useListDefinitionsQuery,
  )({
    variables: {},
  });

  return (
    <>
      {error && <div>Error: {error.message}</div>}
      <ListRender
        array={data?.definitions}
        title={
          <PortDefinition.ListLink className="flex-0">
            Definitions
          </PortDefinition.ListLink>
        }
        refetch={refetch}
      >
        {(ex, index) => (
          <DefinitionCard key={index} definition={ex} mates={[]} />
        )}
      </ListRender>
    </>
  );
};

export default List;
