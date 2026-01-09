import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayComponentProps } from "@/providers/display/DisplayContext";
import { useConstantActionQuery } from "@/rekuest/api/graphql";

const Display = (props: DisplayComponentProps) => {
  const { data } = useConstantActionQuery({
    variables: {
      id: props.object,
    },
  });

  return (
    <CardHeader>
      <CardTitle>{data?.action?.name}</CardTitle>
      <CardDescription>{data?.action?.description}</CardDescription>
    </CardHeader>
  );
};

export default Display;
