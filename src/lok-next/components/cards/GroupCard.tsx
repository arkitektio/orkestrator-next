import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LokGroup } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListGroupFragment } from "../../api/graphql";

interface Props {
  item: ListGroupFragment;
  mates?: MateFinder[];
}

const Card = ({ item, mates }: Props) => {
  return (
    <LokGroup.Smart
      object={item?.id}
      mates={mates}
      dragClassName={() =>
        "h-16 relative rounded group text-white bg-center bg-back-999 shadow-lg hover:bg-back-800 transition-all ease-in-out duration-200 group border-gray-700 shadow-xl  border"
      }
    >
      <div className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate flex flex-row">
        <Avatar className="my-auto mr-3">
          <AvatarImage src={item.name} />
          <AvatarFallback>{item.name[0]}</AvatarFallback>
        </Avatar>
        <div className="my-auto ">{item.name}</div>
      </div>
    </LokGroup.Smart>
  );
};

export default Card;
