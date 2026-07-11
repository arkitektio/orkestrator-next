import { ElektroExperiment } from "@/linkers";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useDetailExperimentQuery } from "../api/graphql";

export default (props: ReturnWidgetProps) => {
  const { data } = useDetailExperimentQuery({
    variables: {
      id: String(props.value ?? ""),
    },
  });

  if (!data?.experiment) {
    return <div>Experiment not found</div>;
  }

  return (
    <ElektroExperiment.DetailLink object={data.experiment}>
      <p className="text-xl">{data.experiment.name}</p>
      <p className="text-sm">{data.experiment.id}</p>
    </ElektroExperiment.DetailLink>
  );
};
