import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { RekuestSpace, RekuestToolbox } from "@/linkers";
import { useSpaceQuery } from "@/rekuest/api/graphql";
import ShortcutList from "../components/lists/ShortcutList";

export const ToolboxPage = asDetailQueryRoute(useSpaceQuery, ({ data, refetch }) => {
  return (
    <RekuestSpace.ModelPage
      title={data.space.name}
      object={data.space}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <RekuestSpace.Komments object={data?.space} />,
          }}
        />
      }
    >
      <div className=" p-6">
        <div className="mb-3">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer">
            {data?.space?.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {data.space.id}
          </p>
        </div>

      </div>
    </RekuestSpace.ModelPage>
  );
});


export default ToolboxPage;
