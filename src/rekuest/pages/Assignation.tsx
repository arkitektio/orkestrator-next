import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import {
  DetailAssignationFragment,
  useCancelMutation,
  useDetailAssignationQuery,
  useInterruptMutation,
} from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { ClipboardIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AssignationTimeline } from "../components/AssignationTimeline";
import { withFluss } from "@jhnnsrs/fluss-next";
import {
  useFlowQuery,
  useRunForAssignationQuery,
} from "@/reaktion/api/graphql";
import { ShowFlow } from "@/reaktion/show/ShowFlow";

export const AssignationFlow = (props: {
  id: string;
  assignation: DetailAssignationFragment;
}) => {
  const { data } = withFluss(useFlowQuery)({
    variables: {
      id: props.id,
    },
  });

  const { data: rundata } = withFluss(useRunForAssignationQuery)({
    variables: {
      id: props.assignation.id,
    },
  });

  return (
    <>
      {data?.flow && <ShowFlow flow={data?.flow} />} {JSON.stringify(rundata)}
    </>
  );
};

export default asDetailQueryRoute(
  withRekuest(useDetailAssignationQuery),
  ({ data, refetch }) => {
    const [cancel, _] = withRekuest(useCancelMutation)();
    const [interrupt, __] = withRekuest(useInterruptMutation)();

    const navigate = useNavigate();

    return (
      <ModelPageLayout
        identifier="@rekuest/reservation"
        title={data?.assignation?.reference || data?.assignation.status}
        object={data.assignation.id}
      >
        <DetailPane>
          <DetailPaneHeader>
            <DetailPaneTitle
              actions={
                <Button variant={"outline"} title="Copy to clipboard">
                  <ClipboardIcon />
                </Button>
              }
            >
              {data?.assignation?.reference}
            </DetailPaneTitle>
            <DetailPaneDescription></DetailPaneDescription>
          </DetailPaneHeader>
          <div className="w-full h-[500px] overflow-y-scroll">
            {data?.assignation?.provision?.template?.extension ===
              "reaktion" && (
              <AssignationFlow
                id={data?.assignation?.provision.template?.params["flow"]}
                assignation={data.assignation}
              />
            )}
          </div>
        </DetailPane>
        <DetailPane className="mt-2">
          <DetailPaneHeader>Assign</DetailPaneHeader>
          <Button
            onClick={() =>
              cancel({
                variables: { input: { assignation: data.assignation.id } },
              })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              interrupt({
                variables: { input: { assignation: data.assignation.id } },
              })
            }
          >
            Interrupt
          </Button>
        </DetailPane>
      </ModelPageLayout>
    );
  },
);
