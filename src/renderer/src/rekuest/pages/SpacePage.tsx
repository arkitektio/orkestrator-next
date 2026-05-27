import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { RekuestSpace } from "@/linkers";
import { useSpaceQuery } from "@/rekuest/api/graphql";
import { SpaceViewScene, SpaceViewSceneProvider } from "../space-scene";

export const SpacePage = asDetailQueryRoute(useSpaceQuery, ({ data }) => {
  return (
    <RekuestSpace.ModelPage
      title={data.space.name}
      object={data.space}
      pageActions={
        <div className="flex flex-row gap-2">
          <RekuestSpace.DetailLink object={data.space} subroute="edit">
            Edit
          </RekuestSpace.DetailLink>
          <RekuestSpace.ObjectButton object={data.space} />
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <RekuestSpace.Komments object={data?.space} />,
          }}
        />
      }
    >
      <div className="flex h-full flex-col p-6">
        <div className="mb-3">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer">
            {data?.space?.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {data.space.id}
          </p>
        </div>
        <div className="flex-1 min-h-[500px] rounded-lg border overflow-hidden">
          <SpaceViewSceneProvider space={data.space}>
            <SpaceViewScene />
          </SpaceViewSceneProvider>
        </div>
      </div>
    </RekuestSpace.ModelPage>
  );
});


export default SpacePage;
