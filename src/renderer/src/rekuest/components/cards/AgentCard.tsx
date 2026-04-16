import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestAgent } from "@/linkers";
import { AgentPill } from "@/lok-next/components/AgentPill";
import { DeviceImprint, UserAvatar, UserAvatarUsername } from "@/lok-next/components/UserAvatar";

import { ListAgentFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListAgentFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <RekuestAgent.Smart object={item}>
      <Card
        className={cn(
          "aspect-square flex flex-col relative overflow-visible",
          item.active && "dark:border-primary border ",
        )}
      >
        <CardHeader className="flex-grow">
          <CardTitle>
            <RekuestAgent.DetailLink object={item}>
              {" "}
              <h1 className="flex-wrap break-all">{item.app.identifier}</h1>
              <h2 className="text-sm text-muted-foreground">{item.release.version}</h2>
              <span className="text-muted-foreground font-light">
                {item.instanceId}
              </span>


            </RekuestAgent.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter>
        </CardFooter>

        <UserAvatar sub={item.user.sub} className="absolute bottom-2 right-2 w-8 h-8" />
        <DeviceImprint deviceId={item.device.deviceId} className="absolute bottom-0  w-[80%] translate-y-1/2" />
      </Card>
    </RekuestAgent.Smart>
  );
};

export default TheCard;
