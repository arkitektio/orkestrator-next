import { MikroImage } from "@/linkers";
import { useGetImageQuery } from "@/mikro-next/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";

export const ImageWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetImageQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <MikroImage.DetailLink className="w-full h-full" object={props.value}>
      {data?.image.name}
    </MikroImage.DetailLink>
  );
};
