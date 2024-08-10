import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { DropZone } from "@/components/ui/dropzone";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroExperiment, MikroProtocol } from "@/linkers";
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
            Comments: <MikroExperiment.Komments object={data.protocol.id} />,
          }}
        />
      }
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle actions={<></>}>
            {data?.protocol?.name}
          </DetailPaneTitle>
        </DetailPaneHeader>
        <div className="flex flex-col bg-white p-3 rounded rounded-md mt-2 mb-2">
          <div className="font-light mt-2 ">Created At</div>
          <div className="font-light mt-2 ">Created by</div>

          <div className="font-light mt-2 ">Tags</div>
        </div>
        <ListRender
          title="Contained Steps"
          array={data?.protocol?.steps}
          additionalChildren={
            <>
              <DropZone
                accepts={["item:@mikro/protocol", "list:@mikro/protocol"]}
                className="border border-gray-800 cursor-pointer rounded p-5 text-white bg-gray-900 hover:shadow-lg truncate"
                onDrop={async (item) => {
                  console.log(item);
                }}
                canDropLabel={
                  "Drag datasets here to associated with this Dataset"
                }
                overLabel={"Release to add"}
              />
            </>
          }
        >
          {(step, index) => <>{step.t}</>}
        </ListRender>
      </DetailPane>
    </MikroProtocol.ModelPage>
  );
});
