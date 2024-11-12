import { Card } from "@/components/ui/card";
import { KraphProtocolStep } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListProtocolStepFragment } from "@/kraph/api/graphql";

interface Props {
  item: ListProtocolStepFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphProtocolStep.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2 h-20 transition-all ease-in-out duration-200 truncate">
        <KraphProtocolStep.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}{" "}
          <p className="text-muted-foreground text-xs">{item?.description}</p>
        </KraphProtocolStep.DetailLink>
      </Card>
    </KraphProtocolStep.Smart>
  );
};

export default TheCard;
