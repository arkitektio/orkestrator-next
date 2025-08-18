import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroTrace } from "@/linkers";
import { useDetailTraceQuery } from "../api/graphql";
import { TraceRender } from "../components/TraceRender";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useDetailTraceQuery,
  ({ data, subscribeToMore }) => {

    return (
      <ElektroTrace.ModelPage
        title={data?.trace?.name}
        object={data.trace.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroTrace.ObjectButton object={data.trace.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroTrace.Komments object={data.trace.id} />,
            }}
          />
        }
      >
        <TraceRender trace={data.trace} />
      </ElektroTrace.ModelPage>
    );
  },
);
