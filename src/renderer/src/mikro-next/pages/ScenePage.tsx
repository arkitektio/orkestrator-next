import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import {
  DetailPane,
  DetailPaneContent
} from "@/components/ui/pane";
import { MikroScene } from "@/linkers";
import {
  useGetSceneQuery
} from "../api/graphql";
import { Scene } from "../components/scene/Scene";

export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(
  useGetSceneQuery,
  ({ data, refetch, subscribeToMore, id }) => {



    return (
      <MikroScene.ModelPage
        variant={"black"}
        actions={<MikroScene.Actions object={id} />}
        object={data.scene}
        title={data?.scene?.name}
      >


        <div className="w-full h-full relative">
          {data.scene && <Scene scene={data.scene} />}

          <DetailPane className="w-full absolute w-[200px] top-3 left-3 @container p-2 bg-black bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 z-100 overflow-hidden flex flex-col h-max-[400px]">


            <DetailPaneContent className="flex flex-col">
              {data?.scene?.name}
            </DetailPaneContent>
          </DetailPane>
        </div>
      </MikroScene.ModelPage>
    );
  },
);

export default Page;
