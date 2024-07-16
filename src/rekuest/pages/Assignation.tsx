import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { useRunForAssignationQuery } from "@/reaktion/api/graphql";
import { TrackFlow } from "@/reaktion/track/TrackFlow";
import {
  DetailAssignationFragment,
  useCancelMutation,
  useDetailAssignationQuery,
  useInterruptMutation,
  WatchAssignationEventsDocument,
  WatchAssignationEventsSubscription,
  WatchAssignationEventsSubscriptionVariables,
} from "@/rekuest/api/graphql";
import { ClipboardIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref } from "yup";
import { useInstancId } from "../hooks/useInstanceId";

export const AssignationFlow = (props: {
  id: string;
  assignation: DetailAssignationFragment;
}) => {
  const { data, error, refetch } = useRunForAssignationQuery({
    variables: {
      id: props.assignation.id,
    },
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      setTimeout(refetch, 1000);
    }
  }, [error]);

  return (
    <>
      {data?.runForAssignation && (
        <TrackFlow
          run={data.runForAssignation}
          assignation={props.assignation}
        />
      )}
      {error && <div>Error: {error.message}</div>}
    </>
  );
};

export const DefaultRenderer = (props: {
  assignation: DetailAssignationFragment;
}) => {
  const [cancel, _] = useCancelMutation();
  const [interrupt, __] = useInterruptMutation();

  return (
    <>
      <DetailPane>
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <Button variant={"outline"} title="Copy to clipboard">
                <ClipboardIcon />
              </Button>
            }
          >
            {props?.assignation?.reference}
          </DetailPaneTitle>
          <DetailPaneDescription></DetailPaneDescription>
        </DetailPaneHeader>
        <div className="w-full h-[500px] overflow-y-scroll">
          {props?.assignation?.provision?.template?.extension ===
            "reaktion_next" && (
            <AssignationFlow
              id={props?.assignation?.provision.template?.params["flow"]}
              assignation={props.assignation}
            />
          )}
        </div>
      </DetailPane>
      <DetailPane className="mt-2">
        <DetailPaneHeader>Assign</DetailPaneHeader>
        <Button
          onClick={() =>
            cancel({
              variables: { input: { assignation: props.assignation.id } },
            })
          }
        >
          Cancel
        </Button>
        <Button
          onClick={() =>
            interrupt({
              variables: { input: { assignation: props.assignation.id } },
            })
          }
        >
          Interrupt
        </Button>
      </DetailPane>
    </>
  );
};

export const WorkflowRender = (props: {
  assignation: DetailAssignationFragment;
}) => {
  return (
    <div className="w-full h-[500px] overflow-y-scroll">
      <AssignationFlow
        id={props?.assignation?.provision?.template?.params["flow"]}
        assignation={props.assignation}
      />
    </div>
  );
};

export default asDetailQueryRoute(
  useDetailAssignationQuery,
  ({ data, refetch, subscribeToMore }) => {
    const navigate = useNavigate();

    return (
      <ModelPageLayout
        identifier="@rekuest/reservation"
        title={data?.assignation?.reference || data?.assignation.status}
        object={data.assignation.id}
      >
        {data?.assignation?.provision?.template?.extension ===
        "reaktion_next" ? (
          <AssignationFlow
            id={data?.assignation?.provision.template?.params["flow"]}
            assignation={data.assignation}
          />
        ) : (
          <DefaultRenderer assignation={data.assignation} />
        )}
      </ModelPageLayout>
    );
  },
);
