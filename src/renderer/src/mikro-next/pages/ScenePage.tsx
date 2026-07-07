import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MikroScene } from "@/linkers";
import {
  useGetSceneQuery
} from "../api/graphql";
import { Scene } from "../components/scene/Scene";

export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(
  useGetSceneQuery,
  ({ data, id }) => {
    return (
      <MikroScene.ModelPage
        variant={"black"}
        actions={<MikroScene.Actions object={id} />}
        object={data.scene}
        title={data?.scene?.name}
      >
        <div className="w-full h-full relative">
          {data.scene && <Scene scene={data.scene} />}
        </div>
      </MikroScene.ModelPage>
    );
  },
);

export default Page;
