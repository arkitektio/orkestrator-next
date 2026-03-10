import { DisplayWidgetProps } from "@/lib/display/registry";
import { KabinetPod } from "@/linkers";
import { useGetPodQuery } from "../api/graphql";

export const PodDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetPodQuery({
    variables: {
      id: props.object,
    }
  });

  return (
    <KabinetPod.DetailLink object={props.object}>
      <p className="text-xl">
        {data?.pod?.deployment.flavour?.release?.app.identifier}
      </p>
      <p className="text-sm">Deployed on {data?.pod?.backend.name}</p>
    </KabinetPod.DetailLink>
  );
};
