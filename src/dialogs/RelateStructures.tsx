import { Structure } from "@/actions/action-registry";
import { useDialog } from "@/app/dialog";
import {
  ListStructureRelationCategoryFragment,
  ListStructureRelationCategoryWithGraphFragment,
  useCreateStructureMutation,
  useCreateStructureRelationMutation,
  useListStructureRelationCategoryQuery,
} from "@/kraph/api/graphql";
import { toast } from "sonner";

export const RelateStructures = (props: {
  left: Structure[];
  right: Structure[];
}) => {
  const { data, error } = useListStructureRelationCategoryQuery({
    variables: {
      filters: {
        sourceIdentifier: props.left.at(0)?.identifier,
        targetIdentifier: props.right.at(0)?.identifier,
      },
    },
    fetchPolicy: "network-only",
  });

  const { closeDialog } = useDialog();

  const [createStructure] = useCreateStructureMutation({
    onCompleted: (data) => {
      console.log("Structure created:", data);
    },
    onError: (error) => {
      console.error("Error creating structure:", error);
    },
  });

  const [createSRelation] = useCreateStructureRelationMutation({
    onCompleted: (data) => {
      console.log("Relation created:", data);
    },
    onError: (error) => {
      console.error("Error creating relation:", error);
    },
  });

  const handleRelationCreation = async (
    category: ListStructureRelationCategoryWithGraphFragment,
  ) => {
    try {
      const leftStructureString = `${props.left.at(0)?.identifier}:${props.left.at(0)?.object}`;
      const rightStructureString = `${props.right.at(0)?.identifier}:${props.right.at(0)?.object}`;

      const left = await createStructure({
        variables: {
          input: {
            structure: leftStructureString,
            graph: category.graph.id,
          },
        },
      });

      const right = await createStructure({
        variables: {
          input: {
            structure: rightStructureString,
            graph: category.graph.id,
          },
        },
      });

      await createSRelation({
        variables: {
          input: {
            source: left.data?.createStructure.id,
            target: right.data?.createStructure.id,
            category: category.id,
          },
        },
      });

      closeDialog();
      toast.success("Relation created successfully!");
    } catch (error) {
      toast.error(
        `Failed to create relation: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      console.error("Failed to create relation:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="flex flex-col space-y-4">Relating structures...</div>

      {error && <div className="text-red-500">Error: {error.message}</div>}
      {!data && <div className="text-gray-500">Loading...</div>}

      {data?.structureRelationCategories?.map((category) => (
        <div
          key={category.id}
          className="p-2 border rounded-lg w-full cursor-pointer hover:bg-gray-100"
          onClick={() => handleRelationCreation(category)}
        >
          <div className="font-bold">{category.label}</div>
          <div className="text-sm text-gray-500">{category.description}</div>
        </div>
      ))}
    </div>
  );
};
