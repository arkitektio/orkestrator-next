import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokApp, LokComputeNode } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListAppFragment, ListComputeNodeFragment } from "../../api/graphql";

interface Props {
  item: ListComputeNodeFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const resolve = useResolve();

  return (
    <LokComputeNode.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        <LokComputeNode.DetailLink object={item.id} className="">
          {item.name || item.nodeId}
          <br />
        </LokComputeNode.DetailLink>
      </Card>
    </LokComputeNode.Smart>
  );
};

export default TheCard;
