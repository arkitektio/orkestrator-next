import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokClient } from "@/linkers";
import { Server, User } from "lucide-react";
import { MateFinder } from "../../../mates/types";
import { ListClientFragment } from "../../api/graphql";

interface Props {
  item: ListClientFragment;
  mates?: MateFinder[];
}

const ClientCard = ({ item, mates }: Props) => {
  const resolve = useResolve();

  return (
    <LokClient.Smart object={item?.id} mates={mates}>
      <LokClient.DetailLink object={item.id} className="block h-full">
        <Card className="h-full hover:bg-muted/50 transition-colors group">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
            <Avatar className="h-10 w-10 rounded-lg border bg-muted">
              <AvatarImage
                src={resolve(item.logo?.presignedUrl)}
                alt={item.release.app.identifier}
                className="object-contain"
              />
              <AvatarFallback className="rounded-lg">
                {item.release.app.identifier.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 overflow-hidden">
              <CardTitle className="text-base font-semibold truncate leading-none flex items-center gap-2">
                <span className="truncate">{item.release.app.identifier}</span>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                  v{item.release.version}
                </Badge>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                <User className="h-3.5 w-3.5" />
                <span className="truncate">
                  {item.user?.username || "Unknown User"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                <Server className="h-3.5 w-3.5" />
                <span className="truncate">
                  {item.node?.name || "Unassigned Node"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </LokClient.DetailLink>
    </LokClient.Smart>
  );
};

export default ClientCard;
