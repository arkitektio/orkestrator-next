import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayComponentProps } from "@/providers/display/DisplayContext";
import { useConstantNodeQuery } from "@/rekuest/api/graphql";

const Display = (props: DisplayComponentProps) => {
  const { data } = useConstantNodeQuery({
    variables: {
      id: props.object,
    },
  });

  return (
    <CardHeader>
      <CardTitle>{data?.node?.name}</CardTitle>
      <CardDescription>{data?.node?.description}</CardDescription>
    </CardHeader>
  );
};

export default Display;
