import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import { LokUser } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListUserFragment, useNotifyUserMutation } from "../../api/graphql";
import { Button } from "@/components/ui/button";

interface Props {
  item: ListUserFragment;
  mates?: MateFinder[];
}



const TheCard = ({ item }: Props) => {
  return (
    <LokUser.Smart object={item?.id}>
      <Card className="h-32 px-4">
        <CardTitle>{item.username}
        <LokUser.DetailLink
          object={item.id}
        >
          <Avatar className="">
            <AvatarFallback>{item.username[0]}</AvatarFallback>
          </Avatar>
        </LokUser.DetailLink>
        </CardTitle>
      </Card>
    </LokUser.Smart>
  );
};

export default TheCard;
