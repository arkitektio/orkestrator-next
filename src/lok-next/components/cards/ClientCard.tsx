import { LokClient, LokUser } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListClientFragment } from "../../api/graphql";
import { Card } from "@/components/ui/card";

interface Props {
  item: ListClientFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokClient.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        <LokClient.DetailLink object={item.id} className="">
          {item.release.app.identifier}cc
        </LokClient.DetailLink>
        {item.user && (
          <>
            {" "}
            Bound to{" "}
            <LokUser.DetailLink object={item.user.id}>
              {item.user.username}
            </LokUser.DetailLink>
          </>
        )}
      </Card>
    </LokClient.Smart>
  );
};

export default TheCard;
