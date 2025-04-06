import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestAgent } from "@/linkers";
import { ClientAvatar } from "@/lok-next/components/ClientAvatar";
import { UserAvatarUsername } from "@/lok-next/components/UserAvatar";
import { MateFinder } from "@/mates/types";
import { ListAgentFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListAgentFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestAgent.Smart object={item?.id}>
      <Card
        className={cn(
          "aspect-square flex flex-col",
          item.connected && "dark:border-green-300 border ",
        )}
      >
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestAgent.DetailLink object={item?.id}>
              {" "}
              <h1 className="flex-wrap break-all">{item.name}</h1>
              <span className="text-muted-foreground font-light">
                {item.instanceId}
              </span>
            </RekuestAgent.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <UserAvatarUsername sub={item.registry.user.id} />
          <ClientAvatar clientId={item.registry.app.clientId} />
        </CardFooter>
      </Card>
    </RekuestAgent.Smart>
  );
};

export default TheCard;
