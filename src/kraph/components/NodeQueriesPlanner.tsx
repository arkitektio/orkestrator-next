import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KraphGraphQuery, KraphNodeQuery } from "@/linkers";
import {
  BaseCategoryFragment,
  EntityFragment,
  ListGraphQueryFragment,
  ListNodeQueryFragment,
  usePinGraphQueryMutation,
  usePinNodeQueryMutation,
} from "../api/graphql";
import { Badge } from "@/components/ui/badge";
import { Pin, UnplugIcon } from "lucide-react";
import { TbPin, TbPinned } from "react-icons/tb";

export const NodeQueriesPlanner = ({ entity }: { entity: EntityFragment }) => {
  const [pin] = usePinNodeQueryMutation();

  return (
    <>
      <div className="flex flex-row ">
        {entity.relevantQueries.map((query) => (
          <Card key={query.id} className="p-2 m-2 flex-row gap-2 flex">
            <div className="flex flex-col">
              <KraphNodeQuery.DetailLink
                object={query.id}
                className="w-full font-light"
              >
                {query.name}
              </KraphNodeQuery.DetailLink>
              {query.description && (
                <p className="text-sm text-muted-foreground">
                  {query.description}
                </p>
              )}
            </div>
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
              variant={"outline"}
            >
              {query.pinned ? <TbPin /> : <TbPinned />}
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
};
