import { useDialog } from "@/app/dialog";
import { CommandItem } from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ListMaterializedEdgeFragment,
  ListMaterializedStructureRelationEdgeFragment,
  ListRelationCategoryFragment,
  useCreateRelationMutation,
  useCreateStructureRelationMutation,
  useEnsureStructureMutation,
  useListMaterializedEdgesQuery,
  useListMaterializedStructureRelationEdgesQuery,
  useListMeasurmentCategoryQuery,
  useListRelationCategoryQuery,
} from "@/kraph/api/graphql";
import { Structure } from "@/types";
import { CommandGroup } from "cmdk";
import React from "react";
import { toast } from "sonner";
import type { PassDownProps } from "../types";

export const EntityRelateButton = (props: {
  relation: ListRelationCategoryFragment;
  left: Structure[];
  right: Structure[];
  children: React.ReactNode;
}) => {
  const [createRelation] = useCreateRelationMutation();

  const handleRelationCreation = async () => {
    for (const left of props.left) {
      for (const right of props.right) {
        try {
          await createRelation({
            variables: {
              input: {
                sourceId: left.object,
                targetId: right.object,
                category: props.relation.id,
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
    }
  };

  return (
    <CommandItem value={props.relation.label} onSelect={handleRelationCreation} className="flex-1">
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-col">
            <div className="text-md text-gray-100 text-left">{props.relation.label}</div>
            <div className="text-xs text-gray-400 text-left">{props.relation.description}</div>
          </div>
          <div className="flex-grow" />
        </TooltipTrigger>
        <TooltipContent>{props.relation.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

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
              object: object.object,
              identifier: object.identifier,
              graph: props.materializedEdge.graph.id,
            } as never,
          },
        });

        const right = await createStructure({
          variables: {
            input: {
              object: props.right.object,
              identifier: props.right.identifier,
              graph: props.materializedEdge.graph.id,
            } as never,
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
    <CommandItem value={props.materializedEdge.id} onSelect={handleRelationCreation} className="flex-1">
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-col">
            <div className="text-md text-gray-100 text-left">{props.materializedEdge.edge.label}</div>
            <div className="text-xs text-gray-400 text-left">{props.materializedEdge.graph.name}</div>
          </div>
          <div className="flex-grow" />
        </TooltipTrigger>
        <TooltipContent>{props.materializedEdge.edge.label}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const CreateMeasurementButton = (props: {
  edge: ListMaterializedEdgeFragment;
  left: PassDownProps;
  children: React.ReactNode;
}) => {
  const dialog = useDialog();

  return (
    <CommandItem
      value={props.edge.id}
      onSelect={() => {
        dialog.openDialog("setasmeasurement", {
          left: props.left.objects,
          edge: props.edge,
        });
      }}
      className="flex-1"
    >
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-1">
            <div className="text-md text-gray-100 text-left flex flex-row gap-2">
              Measure <pre className="my-auto">{props.edge.graph.name}</pre>
            </div>
            <div className="text-xs text-gray-400 text-left">{props.edge.graph.id}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>{props.edge.graph.name}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const EntityRelationActions = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects.at(0);
  const dialog = useDialog();

  const { data, error } = useListRelationCategoryQuery({
    variables: {
      filters: {
        search: props.filter && props.filter !== "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  if (!firstPartner || !firstObject) {
    return null;
  }

  return (
    <CommandGroup
      heading={<span className="font-light text-xs w-full items-center ml-2 w-full">Relate Entities</span>}
    >
      {data?.relationCategories.map((relation) => (
        <EntityRelateButton
          relation={relation}
          right={props.partners || []}
          left={props.objects}
          key={relation.id}
        >
          {relation.label}
        </EntityRelateButton>
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
        Create new Relation
      </CommandItem>
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
      heading={<span className="font-light text-xs w-full items-center ml-2 w-full">Relate...</span>}
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
        Create new Relation
      </CommandItem>
    </CommandGroup>
  );
};

export const MeasurementActions = (props: PassDownProps) => {
  const firstObject = props.objects.at(0);
  const dialog = useDialog();
  const { data, error } = useListMeasurmentCategoryQuery({
    variables: {
      filters: {
        search: props.filter && props.filter !== "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  if (!firstObject) {
    return null;
  }

  return (
    <CommandGroup
      heading={<span className="font-light text-xs w-full items-center ml-2 w-full">Measure...</span>}
    >
      {data?.measurementCategories.map((category) => (
        <CommandItem
          key={category.id}
          value={category.id}
          onSelect={() =>
            dialog.openDialog("createnewmeasurement", {
              left: props.objects,
              right: [],
            })
          }
          className="flex-1"
        >
          {category.label}
        </CommandItem>
      ))}
      {error && (
        <CommandItem value="error" className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
    </CommandGroup>
  );
};

export const ApplicableMeasurements = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects.at(0);
  const dialog = useDialog();

  const { data, error } = useListMaterializedEdgesQuery({
    variables: {
      filters: {
        search: props.filter && props.filter !== "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  if (firstPartner || !firstObject) {
    return null;
  }

  return (
    <CommandGroup
      heading={<span className="font-light text-xs w-full items-center ml-2 w-full">Measures...</span>}
    >
      {data?.materializedEdges.map((edge) => (
        <CreateMeasurementButton edge={edge} left={props} key={edge.id}>
          {edge.graph.name}
        </CreateMeasurementButton>
      ))}
      {error && (
        <CommandItem value="error" className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
      <CommandItem
        value="no-relation"
        onSelect={() =>
          dialog.openDialog("createnewmeasurement", {
            left: props.objects,
            right: props.partners || [],
          })
        }
        className="flex-1"
      >
        Create new Measurement
      </CommandItem>
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
