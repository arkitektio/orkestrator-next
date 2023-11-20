import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DisplayComponentProps } from "@/providers/display/DisplayContext";
import { useConstantNodeQuery } from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";

const Display = (props: DisplayComponentProps) => {
  const { data } = withRekuest(useConstantNodeQuery)({
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
