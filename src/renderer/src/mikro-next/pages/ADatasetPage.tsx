import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MikroADataset, MikroCoordinateSystem, MikroScene } from "@/linkers";
import { Clapperboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateSceneFromDatasetMutation } from "../api/graphql";
import { useGetADatasetQuery } from "../api/graphql";
import CoordinateGraphView from "../components/coordinates/CoordinateGraphView";
import AxesTable from "../components/tables/AxesTable";

export const ADatasetPage = asDetailQueryRoute(
  useGetADatasetQuery,
  ({ data }) => {
    const dataset = data.adataset;
    const navigate = useNavigate();

    // The bootstrapped scene is the point of the call, so land in it rather
    // than leaving the user on the dataset wondering whether anything happened.
    // `kind` is left unset: the server infers the layer recipe from the axes.
    const [createScene, { loading }] = useCreateSceneFromDatasetMutation({
      variables: { dataset: dataset.id },
      onCompleted: (result) =>
        navigate(MikroScene.linkBuilder(result.createSceneFromDataset.id)),
    });

    return (
      <MikroADataset.ModelPage
        object={dataset}
        title={dataset.name}
        actions={<MikroADataset.Actions object={dataset} />}
        pageActions={
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => createScene()}
          >
            <Clapperboard className="mr-2 h-4 w-4" />
            {loading ? "Creating scene…" : "Create scene"}
          </Button>
        }
      >
        <div className="flex flex-col gap-3 p-3">
          <div className="flex flex-row items-center gap-2">
            <MikroADataset.DetailLink object={dataset} className="text-3xl">
              {dataset.name}
            </MikroADataset.DetailLink>
            {dataset.multiscale && <Badge variant="outline">multiscale</Badge>}
          </div>
          {dataset.description && (
            <div className="text-muted-foreground">{dataset.description}</div>
          )}
          <div className="font-mono text-sm text-muted-foreground">
            {dataset.axisNames.join(" × ")} ({dataset.shape.join(", ")})
          </div>

          {dataset.intrinsicSystem && (
            <Card>
              <CardHeader>
                <CardTitle>Coordinate graph</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px] p-0">
                {/* Rooted at the intrinsic grid: from there the walk reaches
                    every pyramid level below it and every calibration and world
                    above it. */}
                <CoordinateGraphView
                  coordinateSystem={dataset.intrinsicSystem.id}
                />
              </CardContent>
            </Card>
          )}

          {dataset.intrinsicSystem && (
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-row items-center gap-2">
                  <MikroCoordinateSystem.DetailLink
                    object={dataset.intrinsicSystem}
                  >
                    {dataset.intrinsicSystem.name}
                  </MikroCoordinateSystem.DetailLink>
                  <Badge variant="outline">
                    {dataset.intrinsicSystem.kind}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AxesTable axes={dataset.intrinsicSystem.axes} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Calibrations</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap gap-2">
              {dataset.calibrations.length == 0 ? (
                <div className="text-muted-foreground text-sm">
                  This dataset has no calibrated physical space. Its geometry is
                  only expressed in pixels.
                </div>
              ) : (
                dataset.calibrations.map((calibration) => (
                  <MikroCoordinateSystem.Smart
                    key={calibration.id}
                    object={calibration}
                  >
                    <Card className="px-2 py-2">
                      <MikroCoordinateSystem.DetailLink object={calibration}>
                        {calibration.name}
                      </MikroCoordinateSystem.DetailLink>
                      <div className="text-xs text-muted-foreground font-mono">
                        {calibration.axes
                          .map((axis) => `${axis.name}: ${axis.unit ?? "—"}`)
                          .join(", ")}
                      </div>
                    </Card>
                  </MikroCoordinateSystem.Smart>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data arrays</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Level</TableHead>
                    <TableHead>Shape</TableHead>
                    <TableHead>Chunks</TableHead>
                    <TableHead>Coordinate system</TableHead>
                    <TableHead>Store</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...dataset.dataArrays]
                    .sort((a, b) => a.level - b.level)
                    .map((array) => (
                      <TableRow key={array.id}>
                        <TableCell className="font-mono">
                          {array.level}
                        </TableCell>
                        <TableCell className="font-mono">
                          {array.shape.join(", ")}
                        </TableCell>
                        <TableCell className="font-mono">
                          {array.chunkShape.join(", ")}
                        </TableCell>
                        <TableCell>
                          {array.coordinateSystem ? (
                            <MikroCoordinateSystem.DetailLink
                              object={array.coordinateSystem}
                            >
                              {array.coordinateSystem.name}
                            </MikroCoordinateSystem.DetailLink>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {array.store.key}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </MikroADataset.ModelPage>
    );
  },
);

export default ADatasetPage;
