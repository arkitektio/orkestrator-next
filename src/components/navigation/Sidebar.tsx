import { cn, notEmpty } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import {
  ReservationStatus,
  useAllNodesQuery,
  useReservationsQuery,
} from "@/rekuest/api/graphql";
import { Link, NavLink } from "react-router-dom";
import { StatusPulse } from "../ui/status";
import { SmartModel } from "@/smart/SmartModel";

const colorForReservationStatus = (status: ReservationStatus) => {
  return {
    [ReservationStatus.Active]: "green-500",
    [ReservationStatus.Canceling]: "green-500",
    [ReservationStatus.Cancelled]: "green-500",
    [ReservationStatus.Critical]: "red-500",
    [ReservationStatus.Disconnect]: "red-500",
    [ReservationStatus.Disconnected]: "red-500",
    [ReservationStatus.Ended]: "red-500",
    [ReservationStatus.Error]: "red-500",
    [ReservationStatus.NonViable]: "red-500",
    [ReservationStatus.Providing]: "red-500",
    [ReservationStatus.Rerouting]: "red-500",
    [ReservationStatus.Routing]: "red-500",
    [ReservationStatus.Waiting]: "red-500",
  }[status];
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { data } = withRekuest(useAllNodesQuery)({
    variables: {
      limit: 10,
    },
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
                    isActive && "bg-secondary/60"
                  )}
                >
                  <StatusPulse color={colorForReservationStatus(res.status)} />
                  {res.node.name}
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
      </div>
    </div>
  );
}
