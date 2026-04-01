import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { AsyncBoundary } from "@/components/boundaries/AsyncBoundary";
import { Card } from "@/components/ui/card";
import { RekuestState } from "@/linkers";
import {
  StateFragment,
  useCheckoutQuery,
  useGetStateQuery
} from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "../widgets/WidgetsContext";



export const StateCheckoutDisplay = ({
    state,
    select,
    label,
  }: {
    state: StateFragment;
    label?: boolean;
    select?: string[] | null | undefined;
  }) => {
    const { registry } = useWidgetRegistry();

    const { data, error } = useCheckoutQuery({
      variables: {
        state: state.id,
      },
    });

    const value = data?.checkout?.value || state.value;

    const ports = select
      ? state.stateSchema.ports.filter((p) => select.includes(p.key)) || []
      : state.stateSchema.ports || [];




    return (
      <AsyncBoundary>
        {JSON.stringify(value)}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        <RekuestState.DetailLink object={state} >
        <Card className="grid grid-cols-2 gap-4 p-3">
          {ports.map((port, index) => {
            const Widget = registry.getReturnWidgetForPort(port);

            return (
              <div className="flex-1  flex flex-col gap-2" key={index}>
                {label && <label>{port.key}</label>}
                <Widget
                  key={index}
                  value={value[port.key]}
                  port={port}
                  widget={port.widget}
                />
              </div>
            );
          })}
        </Card>
        </RekuestState.DetailLink>
      </AsyncBoundary>
    );
  };



export const StatePage =  asDetailQueryRoute(useGetStateQuery, ({ data, refetch }) => {

  return (
    <RekuestState.ModelPage
      title={data.state.stateSchema.name}
      object={data.state}
    >
      <div className=" p-6">
        </div>
        <StateCheckoutDisplay state={data.state} label select={data.state.stateSchema.ports.map(p => p.key)} />

    </RekuestState.ModelPage>
  );
});


export default StatePage
