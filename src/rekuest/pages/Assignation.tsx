import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Button } from "@/components/ui/button";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { RekuestAssignation } from "@/linkers";
import { useRunForAssignationQuery } from "@/reaktion/api/graphql";
import { TrackFlow } from "@/reaktion/track/TrackFlow";
import {
  DetailAssignationFragment,
  useCancelMutation,
  useDetailAssignationQuery,
  useInterruptMutation,
} from "@/rekuest/api/graphql";
import { ClipboardIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNodeAction } from "../hooks/useNodeAction";

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

export const useReassign = ({
  assignation,
}: {
  assignation: DetailAssignationFragment;
}) => {
  const { assign } = useNodeAction({
    id: assignation.provision?.template.id || "",
  });
  const navigate = useNavigate();

  const reassign = async () => {
    let x = await assign({
      args: assignation.args,
      template: assignation.provision?.template.id || "",
      hooks: [],
    });

    navigate(RekuestAssignation.linkBuilder(x.id));
  };

  return reassign;
};

export default asDetailQueryRoute(
  useDetailAssignationQuery,
  ({ data, refetch, subscribeToMore }) => {
    const navigate = useNavigate();

    const reassign = useReassign({ assignation: data.assignation });

    return (
      <RekuestAssignation.ModelPage
        title={data?.assignation?.reference || data?.assignation.status}
        object={data.assignation.id}
        pageActions={
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              reassign();
            }}
          >
            Rerun
          </Button>
        }
      >
        <div className="flex h-full w-full relative">
          {data?.assignation?.provision?.template?.extension ===
          "reaktion_next" ? (
            <AssignationFlow
              id={data?.assignation?.provision.template?.params["flow"]}
              assignation={data.assignation}
            />
          ) : (
            <DefaultRenderer assignation={data.assignation} />
          )}
        </div>
      </RekuestAssignation.ModelPage>
    );
  },
);
