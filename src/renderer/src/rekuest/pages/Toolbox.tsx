import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { RekuestToolbox } from "@/linkers";
import { useToolboxQuery } from "@/rekuest/api/graphql";
import ShortcutList from "../components/lists/ShortcutList";

export default asDetailQueryRoute(useToolboxQuery, ({ data, refetch }) => {
  return (
    <RekuestToolbox.ModelPage
      title={data.toolbox.name}
      object={data.toolbox.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <RekuestToolbox.Komments object={data?.toolbox?.id} />,
          }}
        />
      }
    >
      <div className=" p-6">
        <div className="mb-3">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer">
            {data?.toolbox?.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {data.toolbox.description}
          </p>
        </div>

      </div>
      <ShortcutList filters={{ toolbox: data.toolbox.id }} />
    </RekuestToolbox.ModelPage>
  );
});
