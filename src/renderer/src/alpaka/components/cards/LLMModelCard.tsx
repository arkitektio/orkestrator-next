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
      <Card className="w-full h-30 flex flex-col p-3  hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-1 border border-gray-200 group" >

        <AlpakaLLMModel.DetailLink object={item.id} className="text-md font-light text-muted-foreground truncate mb-1">
          {item.modelId}

          <p className="text-md">{item.modelId}</p>
        </AlpakaLLMModel.DetailLink>
      </Card >
    </AlpakaLLMModel.Smart >
  );
};

export default TheCard;
