import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroRenderedPlot } from "@/linkers";
import { ListRenderedPlotFragment } from "../../api/graphql";

interface ImageCardProps {
  item: ListRenderedPlotFragment;

}

const TheCard = ({ item }: ImageCardProps) => {
  const resolve = useResolve();

  const progress = MikroRenderedPlot.useProgress({ object: item.id });
  return (
    <MikroRenderedPlot.Smart
      object={item?.id}
      className="relative group h-20 rounded-lg bg-background bg-center text-white shadow-lg transition-all duration-200 ease-in-out hover:bg-back-800 over:border over:border-primary-200 dragging:ring-primary-200 selected:ring-secondary-500"
    >
      {item?.store.presignedUrl && (
        <Image
          src={resolve(item.store.presignedUrl)}
          style={{ filter: "brightness(0.7)" }}
          className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
        />
      )}
      <div
        className="px-2 py-2 h-full w-full absolute rounded-lg rounded  top-0 left-0 bg-opacity-20  hover:bg-opacity-10 transition-all ease-in-out duration-200 truncate"
        style={{
          backgroundSize: `${progress?.progress || 0}% 100%`,
          backgroundImage: `linear-gradient(to right, #10b981 ${progress?.progress}%, #10b981 ${progress?.progress}%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <MikroRenderedPlot.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={item.id}
        >
          {item?.name}
        </MikroRenderedPlot.DetailLink>
      </div>
    </MikroRenderedPlot.Smart>
  );
};

export default TheCard;
