import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card } from "@/components/ui/card";
import { MikroProtocolStep } from "@/linkers";
import { useGetProtocolStepQuery } from "../api/graphql";

export default asDetailQueryRoute(useGetProtocolStepQuery, ({ data }) => {
  return (
    <MikroProtocolStep.ModelPage
      title={data?.protocolStep?.name}
      object={data.protocolStep.id}
      actions={<MikroProtocolStep.Actions object={data.protocolStep.id} />}
      sidebars={
        <MultiSidebar
          map={{
            Comments: (
              <MikroProtocolStep.Komments object={data.protocolStep.id} />
            ),
          }}
        />
      }
    >
      <div className="h-full w-full flex flex-col">
        <p className="text-muted-foreground text-sm mt-6">Used Reagent</p>
        <div className="flex flex-row">
          <Card className="flex flex-row p-3">
            <div className="flex-1 mr-1">
              {data?.protocolStep?.usedReagent?.id}
            </div>
          </Card>
        </div>

        <p className="text-muted-foreground text-sm mt-2">
          Latest Images inlcuding this step
        </p>
        <div className="flex flex-row gap-2">
          {data?.protocolStep.description}
        </div>
      </div>
    </MikroProtocolStep.ModelPage>
  );
});
