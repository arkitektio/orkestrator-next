import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Sidebars } from "@/components/layout/Sidebars";
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
      // The provider wraps the WHOLE ModelPage so the scene stores reach the
      // right-rail sidebar too — the rail is a sibling panel of the content
      // area, unreachable from anything rendered inside it.
      <Scene.Provider scene={data.scene}>
        <MikroScene.ModelPage
          variant={"black"}
          overlay
          actions={<MikroScene.Actions object={id} />}
          object={data.scene}
          title={data?.scene?.name}
          additionalSidebars={
            <>
              <Sidebars.Tab label="Layers"><Scene.LayersSidebar /></Sidebars.Tab>
              <Sidebars.Tab label="Annotations"><Scene.AnnotationsSidebar /></Sidebars.Tab>
              {/* Only when there is something to list — see Scene.hasMeshLayer. */}
              {Scene.hasMeshLayer(data.scene) && (
                <Sidebars.Tab label="Meshes"><Scene.MeshesSidebar /></Sidebars.Tab>
              )}
              <Sidebars.Tab label="Animations"><Scene.AnimationsSidebar /></Sidebars.Tab>
            </>
          }
          defaultSidebar="Layers"
          sidebarKey="SceneDetail"
        >
          <div className="w-full h-full relative">
            <Scene.Viewport />
          </div>
        </MikroScene.ModelPage>
      </Scene.Provider>
    );
  },
);

export default Page;
