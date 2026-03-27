import { MikroImage } from "@/linkers";
import { useGetImageQuery } from "@/mikro-next/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";

export const ImageWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetImageQuery({
    variables: {
      id: props.value,
    },
  });

  if (!data?.image) {
    return <div>Image not found</div>;
  }

  return (
    <MikroImage.DetailLink className="w-full h-full" object={data?.image}>
      {data?.image.name}
    </MikroImage.DetailLink>
  );
};
