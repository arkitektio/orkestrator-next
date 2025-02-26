import { Card } from "@/components/ui/card";
import { KraphOntology } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListOntologyFragment } from "../../api/graphql";

interface Props {
  item: ListOntologyFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KraphOntology.Smart object={item?.id} mates={mates}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate">
        <KraphOntology.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </KraphOntology.DetailLink>
      </Card>
    </KraphOntology.Smart>
  );
};

export default TheCard;
