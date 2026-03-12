import { LokMapping } from "@/linkers";
import { ListServiceInstanceMappingFragment } from "../../api/graphql";

interface Props {
  item: ListServiceInstanceMappingFragment;

}

const Card = ({ item }: Props) => {
  return (
    <LokMapping.Smart
      object={item?.id}
      className="relative group h-20 rounded bg-center bg-back-999 text-white shadow-lg transition-all duration-200 ease-in-out hover:bg-back-800 over:border over:border-primary-200 dragging:ring-primary-200 selected:ring-secondary-500"
    >
      <LokMapping.DetailLink
        object={item.id}
        className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate"
      >
        {item.instance.identifier}
      </LokMapping.DetailLink>
      #TODO: Remap
    </LokMapping.Smart>
  );
};

export default Card;
