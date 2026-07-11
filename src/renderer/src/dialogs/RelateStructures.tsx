import { useDialog } from "@/app/dialog";
import { Structure } from "@/types";
import {
  ListStructureRelationCategoryWithGraphFragment,
  useCreateStructureRelationMutation,
  useEnsureStructureMutation,
  useListStructureRelationCategoryQuery
} from "@/kraph/api/graphql";
import { toast } from "sonner";

export const RelateStructures = (props: {
  left: Structure[];
  right: Structure[];
}) => {
  const { data, error } = useListStructureRelationCategoryQuery({
    variables: {},
    fetchPolicy: "network-only",
  });

  const { closeDialog } = useDialog();

  const [ensureStructure] = useEnsureStructureMutation({
    onCompleted: () => {},
    onError: (error) => {
      console.error("Error creating structure:", error);
    },
  });

  const [createSRelation] = useCreateStructureRelationMutation({
    onCompleted: () => {},
    onError: (error) => {
      console.error("Error creating relation:", error);
    },
  });

  const handleRelationCreation = async (
    category: ListStructureRelationCategoryWithGraphFragment,
  ) => {
    try {
      const leftStructure = props.left.at(0);
      const rightStructure = props.right.at(0);

      if (!leftStructure || !rightStructure) {
        throw new Error("Missing source or target structure");
      }

      const left = await ensureStructure({
        variables: {
          input: {
            identifier: leftStructure.identifier,
            object: leftStructure.object.id,
            graph: category.graph.id,
          },
        },
      });

      const right = await ensureStructure({
        variables: {
          input: {
            identifier: rightStructure.identifier,
            object: rightStructure.object.id,
            graph: category.graph.id,
          },
        },
      });

      if (!left.data || !right.data) {
        throw new Error("Failed to ensure structures");
      }

      await createSRelation({
        variables: {
          input: {
            sourceId: left.data.ensureStructure.id,
            targetId: right.data.ensureStructure.id,
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
