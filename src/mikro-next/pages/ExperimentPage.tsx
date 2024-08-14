import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ActionButton } from "@/components/ui/action";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroExperiment } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import {
  useCreateProtocolMutation,
  useGetExperimentQuery,
} from "../api/graphql";
import ProtocolCard from "../components/cards/ProtocolCard";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { UpdateExperimentForm } from "../forms/UpdateExperimentForm";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(useGetExperimentQuery, ({ data }) => {
  const [createGroup] = useCreateProtocolMutation({
    variables: {
      experiment: data?.experiment?.id,
      name: "New Protocol",
    },
    refetchQueries: ["GetExperiment"],
  });

  return (
    <MikroExperiment.ModelPage
      title={data?.experiment?.name}
      object={data.experiment.id}
      actions={
        <>
          <ActionButton
            run={() => {
              createGroup();
            }}
            title="Create Protocol"
            description="Create a new Protocol for this Experiment"
          >
            Create Protocol
          </ActionButton>
          <MikroExperiment.Actions object={data.experiment.id} />
        </>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroExperiment.Komments object={data.experiment.id} />,
            Provenance: <ProvenanceSidebar items={data?.experiment.history} />,
          }}
        />
      }
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <>
                <FormSheet trigger={<HobbyKnifeIcon />}>
                  {data?.experiment && (
                    <UpdateExperimentForm experiment={data?.experiment} />
                  )}
                </FormSheet>
              </>
            }
          >
            {data?.experiment?.name}
          </DetailPaneTitle>
          {data?.experiment?.description}
        </DetailPaneHeader>
        <ListRender
          title="Contained Protocols"
          array={data?.experiment?.protocols}
        >
          {(protocol, index) => <ProtocolCard item={protocol} key={index} />}
        </ListRender>
      </DetailPane>
    </MikroExperiment.ModelPage>
  );
});
