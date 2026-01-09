import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { cn } from "@/lib/utils";
import { MikroImage } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListImageFragment } from "../../api/graphql";

interface ImageCardProps {
  item: ListImageFragment;
  className?: string;
}

const ImageCard = ({ item, className }: ImageCardProps) => {
  const resolve = useResolve();

  const { progress } = MikroImage.useLive({ object: item.id });
  return (
    <MikroImage.Smart object={item?.id}>
      <div
        className={cn(
          `relative rounded group text-white bg-center bg-background shadow-lg aspect-square rounded rounded-lg hover:bg-back-800 transition-all ease-in-out duration-200 group-hover:shadow-xl`,
          className,
        )}
      >
        {item.latestSnapshot?.store.presignedUrl && (
          <Image
            src={resolve(item.latestSnapshot?.store.presignedUrl)}
            style={{ filter: "brightness(0.7)" }}
            className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
          />
        )}
        <div
          className="px-2 py-2 h-full w-full absolute rounded-lg rounded  top-0 left-0 bg-opacity-20  hover:bg-opacity-10 transition-all ease-in-out duration-200 flex flex-row "
          style={{
            backgroundSize: `${progress || 0}% 100%`,
            backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
          }}
        >
          <MikroImage.DetailLink
            className={({ isActive } /*  */) =>
              "z-10 font-bold text-md mb-2 cursor-pointer break-words line-clamp-2" +
              (isActive ? "text-primary-300" : "")
            }
            object={item.id}
          >
            {item?.name}
          </MikroImage.DetailLink>
        </div>
      </div>
    </MikroImage.Smart>
  );
};

export default ImageCard;
