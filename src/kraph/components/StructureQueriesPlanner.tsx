import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KraphGraphQuery, KraphNodeQuery } from "@/linkers";
import {
  BaseCategoryFragment,
  ListGraphQueryFragment,
  ListNodeQueryFragment,
  usePinGraphQueryMutation,
  usePinNodeQueryMutation
} from "../api/graphql";

export const StructureQueriesPlanner = ({
  category,
  onGraphQueryClick,
  onNodeQueryClick,
}: {
  category: BaseCategoryFragment;
  onGraphQueryClick?: (query: ListGraphQueryFragment) => void;
  onNodeQueryClick?: (query: ListNodeQueryFragment) => void;
}) => {
  const [pin] = usePinGraphQueryMutation();
  const [pinNode] = usePinNodeQueryMutation();

  return (
    <>
      <div className="flex flex-row p-6">
        {category.relevantQueries.map((query) => (
          <Card
            key={query.id}
            className="p-2 m-2 flex-row gap-2 flex"
            onClick={() => onGraphQueryClick && onGraphQueryClick(query)}
          >
            <KraphGraphQuery.DetailLink object={query.id} className="w-full">
              {query.name}
            </KraphGraphQuery.DetailLink>
            <Button
              onClick={() => {
                pin({
                  variables: {
                    input: {
                      id: query.id,
                      pin: !query.pinned,
                    },
                  },
                });
              }}
            >
              Pin
            </Button>
          </Card>
        ))}
      </div>
      <div className="flex flex-row p-6">
        {category.relevantNodeQueries.map((query) => (
          <Card
            key={query.id}
            className={cn(
              "p-2 m-2 flex-row gap-2 flex",
              query.pinned && "bg-yellow-200",
            )}
            onClick={() => onNodeQueryClick && onNodeQueryClick(query)}
          >
            <KraphNodeQuery.DetailLink object={query.id} className="w-full">
              {query.name}
            </KraphNodeQuery.DetailLink>
            <Button
              onClick={() => {
                pinNode({
                  variables: {
                    input: {
                      id: query.id,
                      pin: !query.pinned,
                    },
                  },
                });
              }}
            >
              Pin
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
};
