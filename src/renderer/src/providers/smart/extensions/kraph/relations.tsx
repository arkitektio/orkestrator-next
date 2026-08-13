import { useDialog } from "@/app/dialog";
import { CommandItem } from "@/components/ui/command";
import {
  ListMaterializedMeasurementEdgeFragment,
  ListMaterializedStructureRelationEdgeFragment,
  useCreateStructureRelationMutation,
  useEnsureStructureMutation,
  useListGraphsQuery,
  useListMaterializedMeasurementsQuery,
  useListMaterializedStructureRelationEdgesQuery,
} from "@/kraph/api/graphql";
import { Structure } from "@/types";
import { CommandGroup } from "cmdk";
import { GitBranchPlus, Network, Ruler, Search } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { CommandActionRow } from "../CommandActionRow";
import type { PassDownProps } from "../types";

export const StructureRelateButton = (props: {
  materializedEdge: ListMaterializedStructureRelationEdgeFragment;
  left: PassDownProps;
  right: Structure;
  children: React.ReactNode;
}) => {
  const [createSRelation] = useCreateStructureRelationMutation();
  const [createStructure] = useEnsureStructureMutation();

  const handleRelationCreation = async () => {
    for (const object of props.left.objects) {
      try {
        const left = await createStructure({
          variables: {
            input: {
              object: object.object.id,
              identifier: object.identifier,
            },
          },
        });

        const right = await createStructure({
          variables: {
            input: {
              object: props.right.object.id,
              identifier: props.right.identifier,
            },
          },
        });

        if (!left.data?.ensureStructure.id || !right.data?.ensureStructure.id) {
          throw new Error("Failed to ensure structures for relation creation");
        }

        await createSRelation({
          variables: {
            input: {
              sourceId: left.data.ensureStructure.id,
              targetId: right.data.ensureStructure.id,
              category: props.materializedEdge.edge.id,
            },
          },
        });

        toast.success("Relation created successfully!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create relation",
        );
      }
    }
  };

  return (
    <CommandActionRow
      value={props.materializedEdge.id}
      onSelect={handleRelationCreation}
      title={props.materializedEdge.edge.label}
      description={props.materializedEdge.graph.name}
      icon={Network}
    />
  );
};

// NOTE: With `createMeasurement` gone from the backend the `setasmeasurement`
// dialog can only browse the candidate entities, so this row is labelled for
// what it actually does rather than promising a write.
export const CreateMeasurementButton = (props: {
  edge: ListMaterializedMeasurementEdgeFragment;
  left: PassDownProps;
  children: React.ReactNode;
}) => {
  const dialog = useDialog();

  return (
    <CommandActionRow
      value={props.edge.id}
      onSelect={() => {
        dialog.openDialog("setasmeasurement", {
          left: props.left.objects,
          edge: props.edge,
        }, { size: "large" });
      }}
      title={<div className="font-light">browse {props.edge.target.label} for {props.edge.edge.label}</div>}
      description={props.edge.graph.name}
      icon={Search}
    />
  );
};

export const StructureRelationActions = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects.at(0);
  const dialog = useDialog();

  const { data, error } = useListMaterializedStructureRelationEdgesQuery({
    variables: {
      filters: {
        sourceIdentifier: firstObject?.identifier || "",
        targetIdentifier: firstPartner?.identifier || "",
        search: props.filter && props.filter !== "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  return (
    <CommandGroup
      heading={<span className="font-light text-xs w-full items-center ml-2 w-full inline-flex gap-2"><span>Relate</span></span>}
    >
      {firstPartner &&
        data?.materializedStructureRelationEdges.map((edge) => (
          <StructureRelateButton
            materializedEdge={edge}
            right={firstPartner}
            left={props}
            key={edge.id}
          >
            {edge.edge.label} - {edge.target.label}
          </StructureRelateButton>
        ))}
      {error && (
        <CommandItem value="error" className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
      <CommandItem
        value="no-relation"
        onSelect={() =>
          dialog.openDialog("createnewrelation", {
            left: props.objects,
            right: props.partners || [],
          })
        }
        className="flex-1"
      >
        <GitBranchPlus className="mr-2 h-4 w-4" />
        Create new Relation
      </CommandItem>
    </CommandGroup>
  );
};

export const MeasurementActions = (props: PassDownProps) => {
  const firstObject = props.objects.at(0);
  const dialog = useDialog();

  const { data: pinnedGraphs } = useListGraphsQuery({
    variables: {
      filters: { pinned: true },
    },
    fetchPolicy: "network-only",
  });

  if (!firstObject) {
    return null;
  }

  if (!pinnedGraphs?.graphs.length) {
    return null;
  }

  return (
    <CommandGroup
      heading={<span className="font-light text-xs w-full items-center ml-2 w-full inline-flex gap-2"><Ruler className="h-3.5 w-3.5" /><span>Create Measurement Category</span></span>}
    >
      {pinnedGraphs.graphs.map((graph) => (
        <CommandActionRow
          key={graph.id}
          value={`create-measurement-${graph.id}`}
          onSelect={() =>
            dialog.openDialog("createnewmeasurement", {
              left: props.objects,
              right: props.partners || [],
              graph: graph.id,
            })
          }
          title={`In "${graph.name}"`}
          description={graph.description ?? undefined}
          icon={Ruler}
        />
      ))}
    </CommandGroup>
  );
};

export const ApplicableMeasurements = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects.at(0);

  const { data, error } = useListMaterializedMeasurementsQuery({
    variables: {
      filters: {
        search: props.filter && props.filter !== "" ? props.filter : undefined,
        sourceIdentifier: firstObject?.identifier || "",
      },
    },
    fetchPolicy: "network-only",
  });

  if (firstPartner || !firstObject) {
    return null;
  }

  return (
    <CommandGroup
      heading={<span className="font-light text-xs w-full items-center ml-2 w-full inline-flex gap-2"><span>Measures</span></span>}
    >
      {data?.materializedMeasurementEdges.map((edge) => (
        <CreateMeasurementButton edge={edge} left={props} key={edge.id}>
          {edge.graph.name}
        </CreateMeasurementButton>
      ))}
      {error && (
        <CommandItem value="error" className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
    </CommandGroup>
  );
};

export const ApplicableRelations = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects.at(0);

  if (!firstPartner && !firstObject) {
    return null;
  }

  if (!firstPartner && firstObject) {
    return <ApplicableMeasurements {...props} />;
  }

  // NOTE: The backend removed `createRelation` / `updateRelation`, so
  // entity <-> entity relations can no longer be created directly — they are
  // now derived from the role mappings of `createNaturalEvent` /
  // `createProtocolEvent`. Rather than offer an entry that always fails, the
  // entity <-> entity case has no applicable actions until an event-based
  // path exists. `createStructureRelation` is unaffected (below).
  if (
    firstPartner?.identifier === "@kraph/entity" &&
    firstObject?.identifier === "@kraph/entity"
  ) {
    return null;
  }

  return <StructureRelationActions {...props} />;
};
