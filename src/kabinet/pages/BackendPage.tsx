import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { withKabinet } from "@/arkitekt";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { KabinetBackend } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useGetBackendQuery } from "../api/graphql";
import { IconForBackendKind } from "../components/IconForBackendKind";
import PodsList from "../components/lists/PodsList";

export default asDetailQueryRoute(
  withKabinet(useGetBackendQuery),
  ({ data, refetch }) => {
    return (
      <KabinetBackend.ModelPage
        title={data?.backend?.name}
        object={data?.backend?.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <KabinetBackend.Komments object={data?.backend?.id} />,
            }}
          />
        }
      >
        <div className="p-3">
          <div className="grid grid-cols-6">
            <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center ">
              <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {data?.backend?.name}
                </h1>
                <p className="mt-3 text-xl text-muted-foreground flex flex-row">
                  <IconForBackendKind
                    kind={data?.backend.kind}
                    className="h-4 w-4 mr-2 my-auto"
                  />
                  {data?.backend?.kind}
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-[3/2] items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{1}</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <Separator className="mt-8 mb-2" />

          <PodsList />
        </div>
      </KabinetBackend.ModelPage>
    );
  },
);
