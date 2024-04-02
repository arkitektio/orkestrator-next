import { LokUser } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListClientFragment, ListUserFragment } from "../../api/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface Props {
  item: ListUserFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokUser.Smart
      object={item?.id}
      mates={mates}
      dragClassName={() => "h-16 relative rounded group text-white bg-center bg-back-999 shadow-lg hover:bg-back-800 transition-all ease-in-out duration-200 group border-gray-700 shadow-xl  border"}
    >

      <LokUser.DetailLink object={item.id} className="px-2 py-2 h-full w-full absolute top-0 left-0 bg-opacity-20 bg-back-999 hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate flex flex-row">
        <Avatar className="my-auto mr-3">
          <AvatarImage src={item.avatar} />
          <AvatarFallback>{item.username[0]}</AvatarFallback>


        </Avatar>
        <div className="my-auto ">
          {item.username}
        </div>
      </LokUser.DetailLink>
    </LokUser.Smart>
  );
};

export default TheCard;
