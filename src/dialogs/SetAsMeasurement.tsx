import { Structure } from "@/actions/action-registry";
import { useDialog } from "@/app/dialog";
import { SearchOptions } from "@/components/fields/SearchField";
import { Button } from "@/components/ui/button";
import {
  CreateMeasurementCategoryMutationVariables,
  ListMeasurementCategoryWithGraphFragment,
  useCreateMeasurementMutation,
  useCreateStructureMutation,
  useListEntitiesQuery
} from "@/kraph/api/graphql";
import { smartRegistry } from "@/providers/smart/registry";
import { toast } from "sonner";

const searchIdentifiers = async ({ search, values }: SearchOptions) => {
  const models = smartRegistry
    .registeredModels()
    .filter((model) => {
      if (values) return values.includes(model.identifier);
      if (search) return model.identifier.includes(search);
      if (!search) return true;
      return false;
    })
    .map((model) => ({
      label: model.identifier,
      value: model.identifier,
    }));
  return models || [];
};

export type FormData = CreateMeasurementCategoryMutationVariables["input"];

export const SetAsMeasurement = (props: {
  left: Structure[];
  measurement?: ListMeasurementCategoryWithGraphFragment;
}) => {
  const { closeDialog } = useDialog();

  const { data } = useListEntitiesQuery({
    variables: {
      filters: {
        graph: props.measurement?.graph.id,
      },
    },
  });

  const [createStructure] = useCreateStructureMutation({
    onCompleted: (data) => {
      console.log("Structure created:", data);
    },
    onError: (error) => {
      console.error("Error creating structure:", error);
    },
  });

  const [createMeasurement] = useCreateMeasurementMutation({
    onCompleted: () => {
      toast.success("Measurement created successfully");
      closeDialog();
    },
  });

  const onClickEntity = async (entityId: string) => {
    if (!props.measurement) {
      toast.error("No measurement selected");
      return;
    }
    try {
      const leftStructureString = `${props.left[0]?.identifier}:${props.left[0]?.object}`;

      const s = await createStructure({
        variables: {
          input: {
            structure: leftStructureString,
            graph: props.measurement.graph.id,
          },
        },
      });

      if (!s.data) {
        toast.error("Failed to create structure");
        return;
      }

      await createMeasurement({
        variables: {
          input: {
            structure: s.data.createStructure.id,
            entity: entityId,
            category: props.measurement.id,
          },
        },
      });
      toast.success("Entity set as measurement successfully");
      closeDialog();
    } catch (error) {
      console.error("Error setting entity as measurement:", error);
      toast.error("Failed to set entity as measurement");
    }
  };

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Associate</h2>
      </div>

      {data?.entities.map((entity) => (
        <Button
          key={entity.id}
          className="mb-4"
          onClick={() => onClickEntity(entity.id)}
        >
          {entity.label} {entity.id}
          {entity.category.label && (
            <span className="text-sm text-gray-500">
              {" "}
              ({entity.category.label})
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};
