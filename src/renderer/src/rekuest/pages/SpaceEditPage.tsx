import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { RekuestSpace } from "@/linkers";
import { useSpaceQuery } from "@/rekuest/api/graphql";
import { SpaceEditScene, SpaceEditSceneProvider } from "../space-scene";

export const SpaceEditPage = asDetailQueryRoute(useSpaceQuery, ({ data }) => {
  return (
    <RekuestSpace.ModelPage
      title={`Edit ${data.space.name}`}
      object={data.space}
      pageActions={
        <div className="flex flex-row gap-2">
          <RekuestSpace.DetailLink object={data.space}>View</RekuestSpace.DetailLink>
          <RekuestSpace.ObjectButton object={data.space} />
        </div>
      }
    >
      <div className="flex h-full flex-col p-6 gap-4">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Edit Space
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Manipulate placements directly in the renderer. Select an item in the scene to move it; transforms persist automatically.
          </p>
        </div>

        <div className="flex-1 min-h-[600px] rounded-lg border overflow-hidden">
          <SpaceEditSceneProvider space={data.space}>
            <SpaceEditScene />
          </SpaceEditSceneProvider>
        </div>
      </div>
    </RekuestSpace.ModelPage>
  );
});

export default SpaceEditPage;
