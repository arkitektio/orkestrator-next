import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LokRedeemToken } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListRedeemTokenFragment } from "../../api/graphql";
import { Card } from "@/components/ui/card";

interface Props {
  item: ListRedeemTokenFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokRedeemToken.Smart object={item?.id} mates={mates}>
      <Card>
        <LokRedeemToken.DetailLink
          object={item.id}
          className="px-2 py-2 h-full w-full bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate flex flex-row"
        >
          <Avatar className="my-auto mr-3">
            <AvatarFallback>{item.user.id}</AvatarFallback>
          </Avatar>
          {item.token}
          <div className="my-auto ">{item.user.id}</div>
          {item.client && <> Claimed</>}
          {item.client && (
            <div className="my-auto">
              {item.client.release.version}
              {item.client.release.app.identifier}
            </div>
          )}
        </LokRedeemToken.DetailLink>
      </Card>
    </LokRedeemToken.Smart>
  );
};

export default TheCard;
