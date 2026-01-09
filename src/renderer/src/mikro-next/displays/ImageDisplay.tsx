import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroImage } from "@/linkers";
import { useGetImageQuery } from "@/mikro-next/api/graphql";
import { FinalRender } from "@/mikro-next/components/render/FInalRender";

export const ImageDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetImageQuery({
    variables: {
      id: props.object,
    },
  });

  const defaultContext = data?.image?.rgbContexts.at(0);

  return (
    <MikroImage.DetailLink object={props.object}>
      <div className="w-full h-full">
        {defaultContext && <FinalRender context={defaultContext} rois={[]} hideControls={true} />}
      </div>
    </MikroImage.DetailLink>
  );
};
