import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroImage } from "@/linkers";
import { useGetImageQuery } from "@/mikro-next/api/graphql";
import { FinalRender } from "@/mikro-next/components/render/FInalRender";

function formatShape(shape: number[] | null | undefined): string {
  if (!shape || shape.length === 0) return "";
  const labels = ["T", "C", "Z", "Y", "X"];
  return shape
    .map((v, i) => `${labels[i] ?? i}:${v}`)
    .join("  ");
}

export const ImageDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetImageQuery({
    variables: {
      id: props.object,
    },
  });

  const defaultContext = data?.image?.rgbContexts.at(0);
  if (!data?.image) {
    return <div className="text-xs text-muted-foreground">Image not found</div>;
  }

  if (props.context === "command") {
    const shape = data.image.store?.shape;
    return (
      <MikroImage.DetailLink object={data.image}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{data.image.name}</span>
          {shape && (
            <span className="text-xs text-muted-foreground font-mono shrink-0">
              {formatShape(shape)}
            </span>
          )}
        </div>
      </MikroImage.DetailLink>
    );
  }

  return (
    <MikroImage.DetailLink object={data?.image}>
      <div className="w-full h-full">
        {defaultContext && <FinalRender context={defaultContext} rois={[]} hideControls={true} />}
      </div>
    </MikroImage.DetailLink>
  );
};
