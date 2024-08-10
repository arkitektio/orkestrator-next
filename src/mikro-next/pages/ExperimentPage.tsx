import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { DropZone } from "@/components/ui/dropzone";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroExperiment } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import Timestamp from "react-timestamp";
import { useGetExperimentQuery } from "../api/graphql";
import ProtocolCard from "../components/cards/ProtocolCard";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";
import { PinToggle } from "../components/ui/PinToggle";
import { UpdateDatasetForm } from "../forms/UpdateDatasetForm";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(useGetExperimentQuery, ({ data }) => {
  return (
    <MikroExperiment.ModelPage
      title={data?.experiment?.name}
      object={data.experiment.id}
      actions={<MikroExperiment.Actions object={data.experiment.id} />}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroExperiment.Komments object={data.experiment.id} />,
            Provenance: <ProvenanceSidebar items={data?.experiment.history} />,
          }}
        />
      }
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <>
                <PinToggle
                  onPin={(e) => {
                    data?.experiment.id;
                  }}
                  pinned={data?.experiment?.pinned || false}
                />
                <FormSheet trigger={<HobbyKnifeIcon />}>
                  {data?.experiment && (
                    <UpdateDatasetForm dataset={data?.experiment} />
                  )}
                </FormSheet>
              </>
            }
          >
            {data?.experiment?.name}
          </DetailPaneTitle>
        </DetailPaneHeader>
        <div className="flex flex-col bg-white p-3 rounded rounded-md mt-2 mb-2">
          <div className="font-light mt-2 ">Created At</div>
          <div className="text-md mt-2 ">
            <Timestamp date={data?.experiment?.createdAt} />
          </div>
          <div className="font-light mt-2 ">Created by</div>

          <div className="font-light mt-2 ">Tags</div>
          <div className="text-xl flex mb-2">
            {data?.experiment?.tags?.map((tag, index) => (
              <>
                <span className="font-semibold mr-2">#{tag} </span>
              </>
            ))}
          </div>
        </div>
        <ListRender
          title="Contained Protocols"
          array={data?.experiment?.protocols}
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
          {(protocol, index) => <ProtocolCard item={protocol} key={index} />}
        </ListRender>
      </DetailPane>
    </MikroExperiment.ModelPage>
  );
});
