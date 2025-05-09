import { Card } from "@/components/ui/card";
import { AlpakaLLMModel } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListLlmModelFragment } from "../../api/graphql";

interface Props {
  item: ListLlmModelFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <AlpakaLLMModel.Smart object={item?.id} mates={mates}>
      <Card className="w-full h-20 relative">
        <AlpakaLLMModel.DetailLink object={item.id}>
          {item.modelId}
        </AlpakaLLMModel.DetailLink>
        <div>{item.modelId}</div>
      </Card>
    </AlpakaLLMModel.Smart>
  );
};

export default TheCard;
