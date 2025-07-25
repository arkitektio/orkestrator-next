"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PairsFragment } from "@/kraph/api/graphql";

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};

export const Pairs = ({ pairs }: { pairs?: PairsFragment }) => {
  return (
    <div className="w-full h-full">
      {pairs?.pairs && pairs.pairs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Source</TableHead>
              <TableHead className="w-[100px]">Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pairs.pairs.map((pair) => (
              <TableRow key={pair.source.id + pair.target.id}>
                <TableCell>{pair.source.id}</TableCell>
                <TableCell>{pair.target.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground">
          No pairs available
        </div>
      )}
    </div>
  );
};
