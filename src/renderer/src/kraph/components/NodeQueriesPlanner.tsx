import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KraphNodeQuery } from "@/linkers";
import { TbPinned } from "react-icons/tb";
import { NodeQuery } from "../api/graphql";

// NOTE: the backend schema no longer exposes `usePinNodeQueryMutation`, and
// `relevantQueries` was moved off of `Entity` onto `EntityCategory` (as
// `relevantNodeQueries`), which isn't currently selected by `EntityFragment`.
// This component has no callers anywhere in the app right now; it's kept
// compiling against the closest still-existing shape, with pinning disabled
// until the backend exposes an equivalent mutation again.
export const NodeQueriesPlanner = ({
  entity,
}: {
  entity: { id: string; category: { relevantNodeQueries: NodeQuery[] } };
}) => {
  return (
    <>
      <div className="flex flex-row ">
        {entity.category.relevantNodeQueries.map((query) => (
          <Card key={query.id} className="p-2 m-2 flex-row gap-2 flex">
            <div className="flex flex-col">
              <KraphNodeQuery.DetailLink
                object={{ id: query.id }}
                subroute="node"
                subobject={entity.id}
                className="w-full font-light"
              >
                {query.label}
              </KraphNodeQuery.DetailLink>
              {query.description && (
                <p className="text-sm text-muted-foreground">
                  {query.description}
                </p>
              )}
            </div>
            <Button variant={"outline"} disabled>
              <TbPinned />
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
};
