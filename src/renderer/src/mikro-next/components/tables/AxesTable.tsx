import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AxisFragment } from "../../api/graphql";

// The axes of a coordinate system are ordered, and that order IS the order of
// the array's dimensions — so they are rendered in `order`, never sorted by name.
export const AxesTable = ({ axes }: { axes: AxisFragment[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Long name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...axes]
          .sort((a, b) => a.order - b.order)
          .map((axis) => (
            <TableRow key={axis.id}>
              <TableCell className="font-mono text-muted-foreground">
                {axis.order}
              </TableCell>
              <TableCell className="font-mono">{axis.name}</TableCell>
              <TableCell>{axis.type}</TableCell>
              <TableCell className="font-mono">{axis.unit ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">
                {axis.longName ?? "—"}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default AxesTable;
