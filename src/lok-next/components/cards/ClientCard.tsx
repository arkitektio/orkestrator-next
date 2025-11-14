import { Card } from "@/components/ui/card";
import { LokClient } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListClientFragment } from "../../api/graphql";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useResolve } from "@/datalayer/hooks/useResolve";

interface Props {
  item: ListClientFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {


  const resolve = useResolve();
  return (
    <LokClient.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        <LokClient.DetailLink object={item.id} className="">
          {item.name}
        </LokClient.DetailLink>
        <Tooltip>
          <TooltipTrigger asChild>
            {item?.id && (
              <LokClient.DetailLink object={item.id}>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    className="rounded-md center"
                    src={resolve(item.logo?.presignedUrl)}
                    alt={item.name}
                  />
                  <AvatarFallback>{item.release.app.identifier.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {item.user?.username}
                {item.node ? <p className="text-muted-foreground">{item.node?.name || "Unlabeled Node"}</p> : ""}
              </LokClient.DetailLink>
            )}
          </TooltipTrigger>

          <TooltipContent>{item.name}</TooltipContent>
        </Tooltip>
      </Card>
    </LokClient.Smart>
  );
};

export default TheCard;
