import { Card } from "@/components/ui/card";
import { KraphProtocolStep, KraphProtocolStepTemplate } from "@/linkers";
import { MateFinder } from "@/mates/types";
import {
  ListProtocolStepFragment,
  ListProtocolStepTemplateFragment,
} from "@/kraph/api/graphql";

interface Props {
  item: ListProtocolStepTemplateFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphProtocolStepTemplate.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphProtocolStepTemplate.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}{" "}
          <p className="text-muted-foreground text-xs">{item?.name}</p>
        </KraphProtocolStepTemplate.DetailLink>
      </Card>
    </KraphProtocolStepTemplate.Smart>
  );
};

export default TheCard;
