import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { RekuestStructure, RekuestToolbox } from "@/linkers";
import {
  ListInputStructureUsageFragmentDoc,
  useGetStructureQuery,
} from "@/rekuest/api/graphql";
import OutputStructureUsageCard from "../components/cards/OutputStructureUsageCard";
import InputStructureUsageCard from "../components/cards/InputStructureUsageCard";

export default asDetailQueryRoute(useGetStructureQuery, ({ data, refetch }) => {
  return (
    <RekuestStructure.ModelPage
      title={data.structure.key}
      object={data.structure.id}
      sidebars={
        <MultiSidebar
          map={{
            Comments: (
              <RekuestStructure.Komments object={data?.structure?.id} />
            ),
          }}
        />
      }
    >
      <div className=" p-6">
        <div className="mb-3">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer">
            {data?.structure?.key}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
            {data.structure.description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0">
        {data.structure.outputUsages.length > 0 && (
          <>
            <h2 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl mb-4">
              Used in Actions
            </h2>
            <div className="mb-6 grid md:grid-cols-7 gap-2 md:items-center">
              {data.structure.outputUsages.map((type) => (
                <OutputStructureUsageCard key={type.id} item={type} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-6 pt-0">
        {data.structure.inputUsages.length > 0 && (
          <>
            <h2 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl mb-4">
              Used as Input in Actions
            </h2>
            <div className="mb-6 grid md:grid-cols-7 gap-2 md:items-center">
              {data.structure.inputUsages.map((type) => (
                <InputStructureUsageCard key={type.id} item={type} />
              ))}
            </div>
          </>
        )}
      </div>
    </RekuestStructure.ModelPage>
  );
});
