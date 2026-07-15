import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MikroCoordinateSystem, MikroTableDataset } from "@/linkers";
import { useGetTableDatasetQuery } from "../api/graphql";
import CoordinateGraphView from "../components/coordinates/CoordinateGraphView";
import AxesTable from "../components/tables/AxesTable";
import { TableDatasetTable } from "../components/tables/TableDatasetTable";

export const TableDatasetPage = asDetailQueryRoute(
  useGetTableDatasetQuery,
  ({ data }) => {
    const dataset = data.tableDataset;

    return (
      <MikroTableDataset.ModelPage
        object={dataset}
        title={dataset.name}
        actions={<MikroTableDataset.Actions object={dataset} />}
        sidebars={<MikroTableDataset.Komments object={dataset} />}
        pageActions={<div className="flex flex-row gap-2"></div>}
      >
        <div className="flex flex-col gap-3 p-3">
          <div className="flex flex-row items-center gap-2">
            <MikroTableDataset.DetailLink
              object={dataset}
              className="text-3xl font-extrabold tracking-tight"
            >
              {dataset.name}
            </MikroTableDataset.DetailLink>
          </div>
          {dataset.description && (
            <div className="text-muted-foreground">{dataset.description}</div>
          )}
          <div className="font-mono text-sm text-muted-foreground">
            {dataset.axisNames.length
              ? dataset.axisNames.join(" × ")
              : "measurement table"}
          </div>

          {/* The table owns its coordinate system: its axes ARE the coordinate
              columns (or a single INDEX axis for a pure measurement table). */}
          <Card>
            <CardHeader>
              <CardTitle>Coordinate graph</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] p-0">
              <CoordinateGraphView
                coordinateSystem={dataset.coordinateSystem.id}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <MikroCoordinateSystem.DetailLink
                  object={dataset.coordinateSystem}
                >
                  {dataset.coordinateSystem.name}
                </MikroCoordinateSystem.DetailLink>
                <Badge variant="outline">{dataset.coordinateSystem.kind}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AxesTable axes={dataset.coordinateSystem.axes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rows</CardTitle>
            </CardHeader>
            <CardContent className="h-[600px]">
              <TableDatasetTable table={dataset} />
            </CardContent>
          </Card>
        </div>
      </MikroTableDataset.ModelPage>
    );
  },
);

export default TableDatasetPage;
