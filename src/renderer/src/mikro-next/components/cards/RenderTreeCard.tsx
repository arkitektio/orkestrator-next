import { MikroRenderTree } from "@/linkers";
import { ListRenderTreeFragment } from "../../api/graphql";

interface Props {
  item: ListRenderTreeFragment;

}

const Card = ({ item }: Props) => {
  return (
    <MikroRenderTree.Smart
      object={item?.id}
      className="relative group h-20 rounded bg-center bg-back-999 text-white shadow-lg transition-all duration-200 ease-in-out hover:bg-back-800 over:border over:border-primary-200 dragging:ring-primary-200 selected:ring-secondary-500"
    >
      <MikroRenderTree.DetailLink
        object={item.id}
        className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate"
      >
        {item.name}
      </MikroRenderTree.DetailLink>
    </MikroRenderTree.Smart>
  );
};

export default Card;
