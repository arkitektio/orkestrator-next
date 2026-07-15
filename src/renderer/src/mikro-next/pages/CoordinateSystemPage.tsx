import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MikroCoordinateSystem } from "@/linkers";
import { useGetCoordinateSystemQuery } from "../api/graphql";
import SceneCard from "../components/cards/SceneCard";
import CoordinateGraphView from "../components/coordinates/CoordinateGraphView";
import AxesTable from "../components/tables/AxesTable";

export const CoordinateSystemPage = asDetailQueryRoute(
  useGetCoordinateSystemQuery,
  ({ data }) => {
    const system = data.coordinateSystem;

    return (
      <MikroCoordinateSystem.ModelPage
        object={system}
        title={system.name}
        actions={<MikroCoordinateSystem.Actions object={system} />}
      >
        <div className="flex flex-col gap-3 p-3">
          <div className="flex flex-row items-center gap-2">
            <MikroCoordinateSystem.DetailLink
              object={system}
              className="text-3xl"
            >
              {system.name}
            </MikroCoordinateSystem.DetailLink>
            <Badge variant="outline">{system.kind}</Badge>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Coordinate graph</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] p-0">
              <CoordinateGraphView coordinateSystem={system.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Axes</CardTitle>
            </CardHeader>
            <CardContent>
              <AxesTable axes={system.axes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scenes</CardTitle>
            </CardHeader>
            <CardContent>
              {system.scenes.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No scenes use this coordinate system as their world yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {system.scenes.map((scene) => (
                    <SceneCard key={scene.id} scene={scene} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MikroCoordinateSystem.ModelPage>
    );
  },
);

export default CoordinateSystemPage;
