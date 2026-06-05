import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KabinetFlavour } from "@/linkers";
import { useGetFlavourQuery } from "../api/graphql";

export const FlavourPage = asDetailQueryRoute(
  useGetFlavourQuery,
  ({ data }) => {
    const flavour = data?.flavour;

    return (
      <KabinetFlavour.ModelPage
        title={flavour?.name}
        object={flavour}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <KabinetFlavour.Komments object={flavour} />,
            }}
          />
        }
        pageActions={<></>}
      >
        <div className="space-y-6 p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
            <div className="space-y-4 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <span>{flavour?.release.app.identifier}</span>
                  <span>•</span>
                  <span>{flavour?.release.version}</span>
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {flavour?.name}
                </h1>
                <CardDescription className="max-w-2xl text-base leading-7">
                  Flavour configuration for {flavour?.release.app.identifier} at
                  version {flavour?.release.version}. The selectors below show
                  where this flavour can run.
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {flavour?.release.app.identifier}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {flavour?.release.version}
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {flavour?.selectors.length || 0} selectors
                </Badge>
              </div>
            </div>

            <Card className="border-dashed bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Quick Facts</CardTitle>
                <CardDescription>Key details for this flavour</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="text-muted-foreground">App</div>
                  <div className="font-medium break-all">
                    {flavour?.release.app.identifier}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Release</div>
                  <div className="font-medium break-all">{flavour?.release.version}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Selectors</div>
                  <div className="font-medium">{flavour?.selectors.length || 0}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Selectors</CardTitle>
              <CardDescription>
                Hardware and runtime constraints attached to this flavour.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {flavour?.selectors.map((selector, index) => (
                <Badge key={`${selector.__typename}-${index}`} variant="secondary" className="rounded-full px-3 py-1">
                  {selector.__typename == "CudaSelector" && "CUDA"}
                  {selector.__typename == "RocmSelector" && "ROCm"}
                  {selector.__typename !== "CudaSelector" && selector.__typename !== "RocmSelector" && selector.__typename}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </KabinetFlavour.ModelPage>
    );
  },
);


export default FlavourPage;
