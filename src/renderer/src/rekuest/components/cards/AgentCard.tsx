import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestAgent } from "@/linkers";
import { AgentPill } from "@/lok-next/components/AgentPill";

import { ListAgentFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListAgentFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <RekuestAgent.Smart object={item}>
      <Card
        className={cn(
          "aspect-square flex flex-col",
          item.active && "dark:border-primary border ",
        )}
      >
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestAgent.DetailLink object={item}>
              {" "}
              <h1 className="flex-wrap break-all">{item.name}</h1>
              <span className="text-muted-foreground font-light">
                {item.instanceId}
              </span>
            </RekuestAgent.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <AgentPill clientId={item.registry.client.clientId} />
        </CardFooter>
      </Card>
    </RekuestAgent.Smart>
  );
};

export default TheCard;
