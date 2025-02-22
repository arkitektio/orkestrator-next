import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useGetOntologyQuery } from "../api/graphql";
import { KraphOntology } from "@/linkers";

export default (props: ReturnWidgetProps) => {
  const { data } = useGetOntologyQuery({
    variables: {
      id: props.value,
    },
  });

  return (
    <KraphOntology.DetailLink object={props.value}>
      <div className="rounded p-3">{data?.ontology?.name}</div>
      <div className="rounded p-3">{data?.ontology?.description}</div>
    </KraphOntology.DetailLink>
  );
};
