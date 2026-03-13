import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphGraph } from "@/linkers";
import { ListGraphFragment } from "../../api/graphql";

interface Props {
  item: ListGraphFragment;
}

const TheCard = ({ item }: Props) => {

  const s3resolve = useResolve();
  return (
    <KraphGraph.Smart object={item?.id}>
      <Card className="px-2 py-2  aspect-square transition-all ease-in-out duration-200 truncate group">
        {item?.image?.presignedUrl && (
          <Image
            src={s3resolve(item?.image?.presignedUrl)}
            style={{ filter: "brightness(0.7)" }}
            className="z-3 object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg p-1 bg-black/30"
          />
        )}
        <div className="p-3 h-full w-full bg-opacity-20 hover:bg-opacity-10 transition-all ease-in-out duration-200 flex flex-col break-all overflow-y-hidden truncate">
          <KraphGraph.DetailLink
            className={({ isActive }) =>
              "z-10 font-bold text-md mb-2 cursor-pointer " +
              (isActive ? "text-primary-300" : "")
            }
            object={item.id}
          >
            {item?.name}
          </KraphGraph.DetailLink>
          <div className="z-10 text-sm flex-grow text-muted-foreground break-words flex-wrap flex">
            {item?.description}
          </div>
        </div>
      </Card>
    </KraphGraph.Smart>
  );
};

export default TheCard;
