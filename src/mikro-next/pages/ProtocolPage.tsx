import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { MikroProtocol } from "@/linkers";
import { useGetProtocolQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(useGetProtocolQuery, ({ data }) => {
  return (
    <MikroProtocol.ModelPage
      title={data?.protocol?.name}
      object={data.protocol.id}
      actions={<MikroProtocol.Actions object={data.protocol.id} />}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroProtocol.Komments object={data.protocol.id} />,
          }}
        />
      }
    >
      <div>
        <div className="text-muted-foreground text-sm my-2">
          {data.protocol.description}
        </div>
      </div>
    </MikroProtocol.ModelPage>
  );
});
