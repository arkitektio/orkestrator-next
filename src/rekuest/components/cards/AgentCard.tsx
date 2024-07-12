import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestAgent } from "@/linkers";
import { useClientQuery } from "@/lok-next/api/graphql";
import { MateFinder } from "@/mates/types";
import { ListAgentFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListAgentFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const { data } = useClientQuery({
    variables: {
      clientId: item.registry.app.clientId,
    },
  });

  return (
    <RekuestAgent.Smart object={item?.id}>
      <Card className={cn(item.connected && "dark:border-green-300 border")}>
        <CardHeader>
          <CardTitle>
            <RekuestAgent.DetailLink object={item?.id}>
              {" "}
              <h1>
                {data?.client?.release.app.identifier}:
                {data?.client.release.version}
              </h1>
              <span className="text-muted-foreground font-light">
                {item.instanceId}
              </span>
            </RekuestAgent.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestAgent.Smart>
  );
};

export default TheCard;
