import { LokComposition } from "@/linkers";
import { ListClientFragment } from "../../api/graphql";
import { clientAppIdentifier } from "@/lok-next/lib/clientLabels";

interface Props {
  item: ListClientFragment;

}

const Card = ({ item }: Props) => {
  return (
    <LokComposition.Smart object={item} >
      <LokComposition.DetailLink
        object={item}
        className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate"
      >
        {clientAppIdentifier(item)}
      </LokComposition.DetailLink>
    </LokComposition.Smart>
  );
};

export default Card;
