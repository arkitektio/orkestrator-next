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
    <div>
      {data?.renderedPlot.store.presignedUrl && (
        <Image
          src={resolve(data?.renderedPlot.store.presignedUrl)}
          className="w-full h-full"
        />
      )}
    </div>
  );
};
