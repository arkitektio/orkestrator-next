import { LokClient, LokComposition } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListClientFragment } from "../../api/graphql";

interface Props {
  item: ListClientFragment;
  mates?: MateFinder[];
}

const Card = ({ item, mates }: Props) => {
  return (
    <LokComposition.Smart object={item?.id} mates={mates}>
      <LokComposition.DetailLink
        object={item.id}
        className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate"
      >
        {item.release.app.identifier}
      </LokComposition.DetailLink>
    </LokComposition.Smart>
  );
};

export default Card;
