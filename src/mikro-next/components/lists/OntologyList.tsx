import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListOntologiesQuery,
} from "../../api/graphql";
import OntologyCard from "../cards/OntologyCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListOntologiesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.ontologies}
      title={
        <MikroDataset.ListLink className="flex-0">
          Ontology
        </MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <OntologyCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
