import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { useGetRenderedPlotQuery } from "@/mikro-next/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";

export const RenderedPlotWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetRenderedPlotQuery({
    variables: {
      id: props.value,
    },
  });

  const resolve = useResolve();

  return (
    <div className="w-[200px] h-[200px]">
      {data?.renderedPlot.store.presignedUrl && (
        <Image
          src={resolve(data?.renderedPlot.store.presignedUrl)}
          className="w-full h-full object-cover absolute top-0 left-0 rounded rounded-lg"
        />
      )}
    </div>
  );
};
