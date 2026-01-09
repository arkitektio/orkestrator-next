import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokApp } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListAppFragment } from "../../api/graphql";

interface Props {
  item: ListAppFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const resolve = useResolve();

  return (
    <LokApp.Smart object={item?.id} mates={mates}>
      <Card className="p-3 truncate">
        <LokApp.DetailLink object={item.id} className="">
          {item.identifier}
          <br />
        </LokApp.DetailLink>
        {item.logo && <Image src={resolve(item.logo.presignedUrl)} />}
      </Card>
    </LokApp.Smart>
  );
};

export default TheCard;
