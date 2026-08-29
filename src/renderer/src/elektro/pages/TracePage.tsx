import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Sidebars } from "@/components/layout/Sidebars";
import { ElektroTrace } from "@/linkers";
import { useDetailTraceQuery } from "../api/graphql";
import { TraceRender } from "../components/TraceRender";


export const TracePage = asDetailQueryRoute(
  useDetailTraceQuery,
  ({ data }) => {

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
          <Sidebars>
            <Sidebars.Tab label="Knowledge">
              <ElektroTrace.Knowledge object={data.trace} />
            </Sidebars.Tab>
          </Sidebars>
        }
      >
        <TraceRender trace={data.trace} />
      </ElektroTrace.ModelPage>
    );
  },
);

export default TracePage;
