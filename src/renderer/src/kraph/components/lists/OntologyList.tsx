import { ListRender } from "@/components/layout/ListRender";
import { KraphOntology } from "@/linkers";
import { OffsetPaginationInput } from "../../api/graphql";

// NOTE: "Ontology" no longer exists as a top-level queryable concept in the
// current backend schema (no OntologyFilter / useListOntologiesQuery /
// OntologyCard remain, and grepping graphql.ts turns up nothing beyond the
// unrelated `OntologyReference` input). Nothing in the app currently renders
// this component. Rather than invent a replacement concept or fabricate a
// card for a removed backend type, this is left as an inert placeholder that
// renders nothing, keeping the file compiling until the concept either comes
// back under a new name or this component is removed for good.
export type Props = {
  pagination?: OffsetPaginationInput;
};

const List = (_props: Props) => {
  return (
    <ListRender<never>
      array={undefined}
      title={
        <KraphOntology.ListLink className="flex-0 text-xs">
          My Ontologies
        </KraphOntology.ListLink>
      }
    >
      {() => null}
    </ListRender>
  );
};

export default List;
