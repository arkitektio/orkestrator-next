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
import { PairsViewerStateProvider, usePairsViewerState } from "./PairsViewerStateProvider";
import { Button } from "@/components/ui/button";
import { p } from "node_modules/@udecode/plate-media/dist/BasePlaceholderPlugin-Dmi28cCy";
import { DisplayWidget } from "@/command/Menu";
import { SmartModel } from "@/providers/smart/SmartModel";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { SmartLink } from "@/providers/smart/builder";

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};

export const EntityCell = ({ entity }: { entity: PairsFragment["pairs"][number]["source"] }) => {

  const { viewerState } = usePairsViewerState();

  if (entity.__typename === "Metric") {
    return (
      <TableCell>
        <Button variant="link">Metric {entity.id}</Button>
      </TableCell>
    );
  }

  if (entity.__typename === "Structure") {
    return (

      <TableCell>
        <ObjectButton objects={[{ object: entity.object, identifier: entity.category.identifier }]} ></ObjectButton>
        <SmartLink
          identifier={entity.category.identifier}
          object={entity.object}
        >
          {viewerState.showWidgets ? <DisplayWidget object={entity.object} identifier={entity.category.identifier} /> : <span>Structure {entity.id}</span>}
        </SmartLink>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <Button variant="link">{entity.id}</Button>
    </TableCell>
  );
};

export const PairRow = ({ pair }: { pair: PairsFragment["pairs"][number] }) => {
  return (
    <TableRow >
      <EntityCell entity={pair.source} />
      <EntityCell entity={pair.target} />
    </TableRow>
  );
};

export const PairsInner = ({ pairs }: { pairs?: PairsFragment }) => {

  const { viewerState, setViewerState } = usePairsViewerState();
  return (
    <div className="w-full h-full">
      <Button
        onClick={() =>
          setViewerState((s) => ({ ...s, showWidgets: !s.showWidgets }))
        }
      >
        {viewerState.showWidgets ? "Hide" : "Show"} Widgets
      </Button>

      {pairs?.pairs && pairs.pairs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Source</TableHead>
              <TableHead className="w-[100px]">Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pairs.pairs.map((pair, index) => (
              <PairRow key={pair.source.id + pair.target.id} pair={pair} />
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


export const Pairs = (props: { pairs?: PairsFragment }) => {
  return (
    <PairsViewerStateProvider>
      <PairsInner {...props} />
    </PairsViewerStateProvider>
  );
};
