import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokApp, LokComputeNode } from "@/linkers";
import { ListAppFragment, ListComputeNodeFragment } from "../../api/graphql";

interface Props {
  item: ListComputeNodeFragment;

}

const TheCard = ({ item }: Props) => {
  const resolve = useResolve();

  return (
    <LokComputeNode.Smart object={item?.id} >
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
