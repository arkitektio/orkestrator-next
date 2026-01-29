import { Structure } from "@/actions/action-registry";
import { useDialog } from "@/app/dialog";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ListSearchField } from "@/components/fields/ListSearchField copy";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { SearchOptions } from "@/components/fields/SearchField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  CreateMeasurementCategoryMutationVariables,
  useCreateMeasurementCategoryMutation,
  useCreateStructureMutation,
  useCreateStructureRelationMutation,
  useSearchEntityCategoryLazyQuery,
  useSearchGraphsLazyQuery,
  useSearchTagsLazyQuery
} from "@/kraph/api/graphql";
import { smartRegistry } from "@/providers/smart/registry";
import { useForm } from "react-hook-form";
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

export const CreateNewMeasurement = (props: {
  left: Structure[];
  right: Structure[];
}) => {
  const { closeDialog } = useDialog();

  const form = useForm<FormData>({
    defaultValues: {
      structureDefinition: {
        identifierFilters: props.left.map((s) => s.identifier),
        tagFilters: [],
      },
      entityDefinition: {
        categoryFilters: [],
        tagFilters: [],
      },
    },
  });

  const [searchGraphs] = useSearchGraphsLazyQuery();
  const [searchCategories] = useSearchEntityCategoryLazyQuery();
  const [searchTags] = useSearchTagsLazyQuery();

  const [createStructure] = useCreateStructureMutation({
    onCompleted: (data) => {
      console.log("Structure created:", data);
    },
    onError: (error) => {
      console.error("Error creating structure:", error);
    },
  });

  const [createMeasurementCategoryMutation] =
    useCreateMeasurementCategoryMutation({
      onCompleted: (data) => {
        console.log("Relation category created:", data);
      },
      onError: (error) => {
        console.error("Error creating relation category:", error);
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

  const handleRelationCreation = async (formData: FormData) => {
    try {
      const result = await createMeasurementCategoryMutation({
        variables: {
          input: {
            ...formData,
          },
        },
      });

      const categoryToUse = result.data?.createMeasurementCategory;

      if (!categoryToUse) {
        throw new Error("No category available for relation creation");
      }

      // Create structures
      const leftStructureString = `${props.left[0]?.identifier}:${props.left[0]?.object}`;
      const rightStructureString = `${props.right[0]?.identifier}:${props.right[0]?.object}`;

      const left = await createStructure({
        variables: {
          input: {
            structure: leftStructureString,
            graph: categoryToUse.graph.id,
          },
        },
      });

      const right = await createStructure({
        variables: {
          input: {
            structure: rightStructureString,
            graph: categoryToUse.graph.id,
          },
        },
      });

      // Create relation
      await createSRelation({
        variables: {
          input: {
            source: left.data?.createStructure.id,
            target: right.data?.createStructure.id,
            category: categoryToUse.id,
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
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create New Measurement</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRelationCreation)}
          className="space-y-6"
        >
          <GraphQLSearchField
            label="Graph"
            name="graph"
            description="Select the graph for this relation"
            searchQuery={searchGraphs}
          />
          <StringField
            label="Label"
            name="label"
            description="Name for the relation category (e.g., 'connects to', 'part of')"
          />
          <ParagraphField
            label="Description"
            name="description"
            description="Describe what this relation represents"
          />
          <StringField
            label="PURL"
            name="purl"
            description="Permanent URL identifier (optional)"
          />

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Source Definition</h4>
              <div className="space-y-2">
                <GraphQLSearchField
                  label="Tag Filters"
                  name="structureDefinition.tagFilters"
                  description="Filter source structures by tags"
                  searchQuery={searchTags}
                />
                <ListSearchField
                  label="Indentifier Filters"
                  name="structureDefinition.identifierFilters"
                  description="Filter source structures by categories"
                  search={searchIdentifiers}
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Target Definition</h4>
              <div className="space-y-2">
                <GraphQLSearchField
                  label="Tag Filters"
                  name="entityDefinition.tagFilters"
                  description="Filter target structures by tags"
                  searchQuery={searchTags}
                />
                <GraphQLListSearchField
                  label="Category Filters"
                  name="entityDefinition.categoryFilters"
                  description="Filter target structures by categories"
                  searchQuery={searchCategories}
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="outline">
            Create New Relation Category
          </Button>
        </form>
      </Form>
    </div>
  );
};
