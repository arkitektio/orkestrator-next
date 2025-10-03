import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { RekuestInterface, RekuestStructure, RekuestToolbox } from "@/linkers";
import {
  useGetInterfaceQuery,
  useGetStructureQuery,
} from "@/rekuest/api/graphql";
import ShortcutList from "../components/lists/ShortcutList";

export default asDetailQueryRoute(useGetInterfaceQuery, ({ data, refetch }) => {
  return (
    <RekuestInterface.ModelPage
      title={data.interface.key}
      object={data.interface.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <RekuestToolbox.Komments object={data?.interface?.id} />,
          }}
        />
      }
    >
      <div className=" p-6">
        <div className="mb-3">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer">
            {data?.interface?.key}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {data.interface.description}
          </p>
        </div>
      </div>
    </RekuestInterface.ModelPage>
  );
});
