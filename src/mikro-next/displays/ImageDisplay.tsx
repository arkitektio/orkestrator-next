import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DisplayComponentProps } from "@/providers/display/DisplayContext";
import { TwoDViewProvider } from "@/providers/view/ViewProvider";
import { useGetImageQuery } from "../api/graphql";

const Display = (props: DisplayComponentProps) => {
  const { data } = useGetImageQuery({
    variables: {
      id: props.object,
    },
  });

  const x = data?.image?.store?.shape?.at(3);
  const y = data?.image?.store?.shape?.at(4);
  const z = data?.image?.store?.shape?.at(2) || 1;
  const t = data?.image?.store?.shape?.at(1) || 1;
  const c = data?.image?.store?.shape?.at(0) || 1;

  const aspectRatio = x && y ? x / y : 1;

  return (
    <CardHeader>
      <CardTitle>{data?.image?.name}</CardTitle>
      <CardDescription>{data?.image?.tags}</CardDescription>
      <CardContent>
        <TwoDViewProvider initialC={0} initialT={0} initialZ={0}>
          <AspectRatio
            ratio={aspectRatio}
            className="overflow-hidden rounded rounded-md shadow shadow-xl"
          ></AspectRatio>
        </TwoDViewProvider>
      </CardContent>
    </CardHeader>
  );
};

export default Display;
