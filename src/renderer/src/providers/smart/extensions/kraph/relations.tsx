import { useDialog } from "@/app/dialog";
import { CommandItem } from "@/components/ui/command";
import {
  ListMaterializedMeasurementEdgeFragment,
  ListMaterializedRelationEdgeFragment,
  ListMaterializedStructureRelationEdgeFragment,
  useAssertRelationExistsMutation,
  useAssertStructureRelationExistsMutation,
  useEnsureStructureMutation,
  useGetListEntityQuery,
  useListGraphsQuery,
  useListMaterializedMeasurementsQuery,
  useListMaterializedRelationEdgesQuery,
  useListMaterializedStructureRelationEdgesQuery,
} from "@/kraph/api/graphql";
import { Structure } from "@/types";
import { CommandGroup } from "cmdk";
import { GitBranchPlus, Network, Ruler } from "lucide-react";
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
  const [createSRelation] = useAssertStructureRelationExistsMutation();
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

        if (!left.data?.ensureStructure.structure.id || !right.data?.ensureStructure.structure.id) {
          throw new Error("Failed to ensure structures for relation creation");
        }

        await createSRelation({
          variables: {
            input: {
              sourceId: left.data.ensureStructure.structure.id,
              targetId: right.data.ensureStructure.structure.id,
              term:
                props.materializedEdge.edge.term?.key ??
                props.materializedEdge.edge.key,
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
      title={<div className="font-light">{props.edge.edge.label} a {props.edge.target.label}</div>}
      description={props.edge.graph.name}
      icon={Ruler}
    />
  );
};

/**
 * Relating two entities is a claim like any other: it names the word, not a
 * category row, so both endpoints are entity ids and the term comes off the
 * materialized edge. No structure has to be ensured first — entities already
 * are nodes.
 */
export const EntityRelateButton = (props: {
  materializedEdge: ListMaterializedRelationEdgeFragment;
  source: Structure;
  target: Structure;
}) => {
  const [assertRelation] = useAssertRelationExistsMutation();

  const handleRelationCreation = async () => {
    try {
      await assertRelation({
        variables: {
          input: {
            sourceId: props.source.object.id,
            targetId: props.target.object.id,
            term:
              props.materializedEdge.edge.term?.key ??
              props.materializedEdge.edge.key,
          },
        },
      });
      toast.success("Relation created successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create relation",
      );
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

/**
 * Which relation categories apply is decided by the two entities' categories,
 * so both are looked up first. The materialized edges are then narrowed to the
 * ones whose endpoints match — offering every relation in the organization
 * would be a list of mostly-inapplicable words.
 */
export const EntityRelationActions = (props: PassDownProps) => {
  const partner = props.partners?.at(0);
  const object = props.objects.at(0);

  const { data: sourceEntity } = useGetListEntityQuery({
    variables: { id: object?.object.id ?? "" },
    skip: !object,
  });
  const { data: targetEntity } = useGetListEntityQuery({
    variables: { id: partner?.object.id ?? "" },
    skip: !partner,
  });

  const { data, error } = useListMaterializedRelationEdgesQuery({
    variables: {
      filters: {
        search: props.filter && props.filter !== "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  const sourceCategoryId = sourceEntity?.entity.category?.id;
  const targetCategoryId = targetEntity?.entity.category?.id;

  const applicable =
    sourceCategoryId && targetCategoryId
      ? (data?.materializedRelationEdges ?? []).filter(
          (edge) =>
            edge.source.id === sourceCategoryId &&
            edge.target.id === targetCategoryId,
        )
      : [];

  if (!object || !partner) {
    return null;
  }

  return (
    <CommandGroup
      heading={<span className="font-light text-xs w-full items-center ml-2 w-full inline-flex gap-2"><span>Relate</span></span>}
    >
      {applicable.map((edge) => (
        <EntityRelateButton
          key={edge.id}
          materializedEdge={edge}
          source={object}
          target={partner}
        />
      ))}
      {error && (
        <CommandItem value="error" className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
    </CommandGroup>
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

  if (
    firstPartner?.identifier === "@kraph/entity" &&
    firstObject?.identifier === "@kraph/entity"
  ) {
    return <EntityRelationActions {...props} />;
  }

  return <StructureRelationActions {...props} />;
};
