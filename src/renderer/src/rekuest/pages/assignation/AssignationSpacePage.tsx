import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { RekuestAssignation } from "@/linkers";
import {
  DetailAssignationFragment,
  useCancelMutation,
  useDetailAssignationQuery,
  useInterruptMutation,
} from "@/rekuest/api/graphql";
import { TaskSpaceScene } from "@/rekuest/components/spaces/task/SpaceScene";
import {
  createSpaceViewStore,
  SpaceViewStoreContext,
  useSpaceViewStore,
} from "@/rekuest/components/spaces/task/store";
import { TaskTimeline } from "@/rekuest/components/spaces/task/panels/TaskTimeline";
import { ChildAssignationUpdater } from "@/rekuest/components/updaters/ChildAssignationUpdater";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type {} from "@react-three/fiber";
import { useEffect, useState } from "react";
import Timestamp from "react-timestamp";
import { isCancalable, isInterruptable, useReassign } from "../AssignationPage";

/**
 * Keeps the store in sync when the GraphQL cache updates
 * (e.g. via the ChildAssignationUpdater subscription).
 */
const StoreRefresher = ({
  assignation,
}: {
  assignation: DetailAssignationFragment;
}) => {
  const refreshTimeline = useSpaceViewStore((s) => s.refreshTimeline);

  useEffect(() => {
    refreshTimeline(assignation);
  }, [assignation, refreshTimeline]);

  return null;
};

export const TaskSpacePage = asDetailQueryRoute(
  useDetailAssignationQuery,
  ({ data, id }) => {
    const reassign = useReassign({ assignation: data.assignation });
    const [cancel] = useCancelMutation();
    const [interrupt] = useInterruptMutation();

    const [store] = useState(() => createSpaceViewStore(data.assignation));

    return (
      <SpaceViewStoreContext.Provider value={store}>
        <StoreRefresher assignation={data.assignation} />
        <RekuestAssignation.ModelPage
          title={
            <div className="flex flex-row gap-2">
              {data?.assignation?.action.name}
              <p className="text-md font-light text-muted-foreground">
                <Timestamp date={data.assignation.createdAt} relative />
              </p>
            </div>
          }
          object={data.assignation}
          pageActions={
            <div className="flex gap-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  reassign();
                }}
              >
                Rerun
              </Button>
              {isCancalable(data.assignation) && (
                <Button
                  onClick={() =>
                    cancel({
                      variables: { input: { assignation: data.assignation.id } },
                    })
                  }
                  variant={"destructive"}
                  size={"sm"}
                >
                  Cancel
                </Button>
              )}
              {isInterruptable(data.assignation) && (
                <Button
                  onClick={() =>
                    interrupt({
                      variables: { input: { assignation: data.assignation.id } },
                    })
                  }
                  variant={"destructive"}
                  size={"sm"}
                >
                  Interrupt
                </Button>
              )}
            </div>
          }
          sidebars={
            <MultiSidebar
              map={{
                Comments: (
                  <RekuestAssignation.Komments object={data?.assignation} />
                ),
              }}
            />
          }
        >
          <ChildAssignationUpdater assignationId={id} />
          <ResizablePanelGroup direction="vertical" className="h-full min-h-[calc(100vh-12rem)] px-3 pb-3">
            <ResizablePanel defaultSize={70} minSize={20}>
              <TaskSpaceScene />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={10}>
              <TaskTimeline />
            </ResizablePanel>
          </ResizablePanelGroup>
        </RekuestAssignation.ModelPage>
      </SpaceViewStoreContext.Provider>
    );
  },
);

export default TaskSpacePage;
