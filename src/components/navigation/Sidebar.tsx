import { Button } from "@/components/ui/button";
import { cn, notEmpty } from "@/lib/utils";
import {
  ReservationStatus,
  useAllNodesQuery,
  useFlowsQuery,
  useReactiveTemplatesQuery,
  useReservationsQuery,
  useWorkspacesQuery,
} from "@/rekuest/api/graphql";
import { SmartModel } from "@/smart/SmartModel";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { NavLink } from "react-router-dom";
import { StatusPulse } from "../ui/status";

const colorForReservationStatus = (status: ReservationStatus) => {
  return {
    [ReservationStatus.Inactive]: "red-500",
    [ReservationStatus.Active]: "green-500",
    [ReservationStatus.Ended]: "gray-500",
    [ReservationStatus.Unconnected]: "yellow-500",
  }[status];
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { data } = withRekuest(useAllNodesQuery)({
    variables: {
      limit: 10,
    },
  });

  const { data: flowsdata } = withRekuest(useFlowsQuery)({
    variables: {
      limit: 10,
    },
  });

  const { data: reactive } = withRekuest(useReactiveTemplatesQuery)({
    variables: {},
  });

  const { data: work } = withRekuest(useWorkspacesQuery)({
    variables: {},
  });

  const { data: resdata } = withRekuest(useReservationsQuery)({
    variables: {
      instanceId: "main",
    },
  });

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Active Reservations
          </h2>
          {resdata?.reservations?.filter(notEmpty).map((res) => (
            <NavLink to={`/reservations/${res.id}`} key={res.id}>
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 group ",
                    isActive && "bg-secondary/60",
                  )}
                >
                  <StatusPulse color={colorForReservationStatus(res.status)} />
                  {res.title}
                </Button>
              )}
            </NavLink>
          ))}
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Nodes
          </h2>
          {data?.nodes?.filter(notEmpty).map((node) => (
            <NavLink to={`/nodes/${node.id}`} key={node.id}>
              {({ isActive }) => (
                <SmartModel identifier="@rekuest-next/node" object={node.id}>
                  {node.name}
                  {node.id}
                </SmartModel>
              )}
            </NavLink>
          ))}
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Reactive
          </h2>
          {reactive?.reactiveTemplates?.filter(notEmpty).map((r) => (
            <NavLink to={`/r/${r.id}`} key={r.id}>
              {({ isActive }) => (
                <SmartModel
                  identifier="@rekuest-next/reactive-template"
                  object={r.id}
                >
                  {r.title}
                </SmartModel>
              )}
            </NavLink>
          ))}
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Flow
          </h2>
          {flowsdata?.flows?.map((flow) => (
            <NavLink to={`/flows/${flow.id}`} key={flow.id}>
              {({ isActive }) => (
                <SmartModel identifier="@rekuest-next/flow" object={flow.id}>
                  {flow.title}
                </SmartModel>
              )}
            </NavLink>
          ))}
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Workspaces
          </h2>
          {work?.workspaces?.map((w) => (
            <NavLink to={`/workspaces/${w.id}`} key={w.id}>
              {({ isActive }) => (
                <SmartModel identifier="@rekuest-next/workspace" object={w.id}>
                  {w.title}
                </SmartModel>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
