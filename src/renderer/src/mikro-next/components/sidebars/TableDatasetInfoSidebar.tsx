import { Badge } from "@/components/ui/badge";
import { MikroCoordinateSystem, MikroTableDataset } from "@/linkers";
import { GetTableDatasetQuery, TableColumnRole } from "../../api/graphql";
import { residentLabel } from "../coordinates/residents";

type PageTable = GetTableDatasetQuery["tableDataset"];

/**
 * Everything about a table dataset that is not its rows — the counterpart of
 * `DatasetInfoSidebar`, section for section, so the two detail pages read the
 * same way: the container's identity and structure in the rail, the data itself
 * in the middle.
 *
 * What the array page says with shape/dtype/levels, a table says with its
 * declared columns: their roles are what makes it either a placeable table (it
 * has COORDINATE columns, which ARE the axes of the space it owns) or a pure
 * measurement table keyed by an index. Everything here comes off the page's own
 * query — no second round trip, unlike the array page's lineage, which the
 * table schema does not expose to us yet.
 */
export const TableDatasetInfoSidebar = ({ dataset }: { dataset: PageTable }) => {
  // `order` is a field, not a position — the API does not promise order.
  const columns = [...dataset.columns].sort((a, b) => a.order - b.order);
  const coordinateColumns = columns.filter(
    (column) => column.role === TableColumnRole.Coordinate,
  );

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      <div className="flex flex-col gap-1">
        {/* `break-all` like the array page's rail: a table name is usually one
            long token, which word-wrap would not break at all. The description
            below is prose and keeps wrapping at spaces. */}
        <MikroTableDataset.DetailLink
          object={dataset}
          className="break-all text-lg font-semibold"
        >
          {dataset.name}
        </MikroTableDataset.DetailLink>
        {dataset.description && (
          <p className="text-sm text-muted-foreground">{dataset.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold">Axes</div>
        <div className="font-mono text-xs text-muted-foreground">
          {dataset.axisNames.length
            ? dataset.axisNames.join(" × ")
            : "measurement table"}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">Columns</span>
          <span className="font-mono text-xs">{columns.length}</span>
        </div>
        {coordinateColumns.length > 0 && (
          <div>
            {/* The count that matters, in the place the array rail badges
                multiscale depth: coordinate columns are what place the rows. */}
            <Badge variant="outline" className="text-[0.625rem]">
              {coordinateColumns.length} coordinate
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold">Coordinate system</div>
        <MikroCoordinateSystem.DetailLink
          object={dataset.coordinateSystem}
          className="break-all text-2xs ellipsis font-mono text-muted-foreground"
        >
          {dataset.coordinateSystem.name}
        </MikroCoordinateSystem.DetailLink>
        <div>
          <Badge variant="outline" className="text-[0.625rem]">
            {residentLabel(dataset.coordinateSystem)}
          </Badge>
        </div>
      </div>

      {/* The declared schema, as rows rather than the five-column AxesTable the
          page used to show in the middle: the rail is too narrow for a table, and
          a column carries its own axis type and unit anyway, so the axes and the
          schema are one list here instead of two. */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-baseline justify-between gap-2">
          <div className="text-xs font-semibold">Schema</div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {columns.length}
          </span>
        </div>

        {columns.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            No columns declared.
          </span>
        ) : (
          columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col gap-1 rounded-md border border-border/60 p-2"
            >
              <div className="flex flex-row items-baseline justify-between gap-2">
                <span className="min-w-0 break-all font-mono text-sm">
                  {column.name}
                </span>
                <Badge
                  variant={
                    column.role === TableColumnRole.Coordinate
                      ? "secondary"
                      : "outline"
                  }
                  className="shrink-0 px-1 py-0 text-[0.625rem] font-normal"
                >
                  {column.role}
                </Badge>
              </div>
              <div className="flex flex-row flex-wrap items-baseline gap-x-2 font-mono text-[0.625rem] text-muted-foreground">
                <span>{column.dtype}</span>
                {column.unit && <span>· {column.unit}</span>}
                {column.axisType && <span>· {column.axisType}</span>}
              </div>
              {column.longName && (
                <div className="text-[0.625rem] text-muted-foreground">
                  {column.longName}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
