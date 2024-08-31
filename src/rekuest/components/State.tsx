import { StateFragment } from "../api/graphql";
import { useWidgetRegistry } from "../widgets/WidgetsContext";

export const StateDisplay = ({
  state,
  select,
  label,
}: {
  state: StateFragment;
  label?: boolean;
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
          <div className="flex-1">
            {label && <label>{port.key}</label>}
            <Widget
              key={index}
              value={state?.value[port.key]}
              port={port}
              widget={port.returnWidget}
            />
          </div>
        );
      })}
    </div>
  );
};
