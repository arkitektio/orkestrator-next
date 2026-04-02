import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroTrace } from "@/linkers";
import { useDetailTraceQuery } from "../api/graphql";
import { TraceRender } from "../components/TraceRender";


export const TracePage = asDetailQueryRoute(
  useDetailTraceQuery,
  ({ data, subscribeToMore }) => {

    return (
      <ElektroTrace.ModelPage
        title={data?.trace?.name}
        object={data.trace}
        pageActions={
          <div className="flex flex-row gap-2">
            <ElektroTrace.ObjectButton object={data.trace} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <ElektroTrace.Komments object={data.trace} />,
            }}
          />
        }
      >
        <TraceRender trace={data.trace} />
      </ElektroTrace.ModelPage>
    );
  },
);

export default TracePage;
