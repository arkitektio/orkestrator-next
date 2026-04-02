import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { KabinetFlavour } from "@/linkers";
import { useGetFlavourQuery } from "../api/graphql";



export  const FlavourPage = asDetailQueryRoute(
  useGetFlavourQuery,
  ({ data, refetch }) => {

    return (
      <KabinetFlavour.ModelPage
        title={data?.flavour?.name}
        object={data?.flavour}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KabinetFlavour.Komments object={data?.flavour} />
              ),
            }}
          />
        }
        pageActions={<></>}
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div className=" p-6">
            <div className="mb-3">
              <h1
                className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer"

              >
                {data?.flavour?.name}
              </h1>
              <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
                {data.flavour.release.version}
              </p>
            </div>
            {JSON.stringify(data.flavour.selectors)}


          </div>
        </div>
      </KabinetFlavour.ModelPage>
    );
  },
);


export default FlavourPage;
