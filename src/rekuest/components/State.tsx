import { StateFragment } from "../api/graphql";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const StateDisplay = ({
  state,
  select,
}: {
  state: StateFragment;
  select?: string[] | null | undefined;
}) => {
  const { registry } = useWidgetRegistry();

  const ports = select
    ? state.stateSchema.ports.filter((p) => select.includes(p.key))
    : state.stateSchema.ports;

  return (
    <div className="w-full h-full flex">
      {ports.map((port, index) => {
        const Widget = registry.getReturnWidgetForPort(port);

        return (
          <>
            <Widget
              key={index}
              value={state?.value[port.key]}
              port={port}
              widget={port.returnWidget}
            />
          </>
        );
      })}
    </div>
  );
};
