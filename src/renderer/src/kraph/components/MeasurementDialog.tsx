import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import {
  useCreateMeasurementCategoryMutation,
  useCreateMeasurementMutation,
  useEnsureStructureMutation,
  useListMeasurmentCategoryLazyQuery,
  useSearchEntitiesLazyQuery,
} from "../api/graphql";

// Machine key generation, mirroring `toSnakeCase` in
// `schema-builder/utils.ts` (kept local/inline here to avoid pulling in that
// module for a single helper).
const slugify = (label: string): string =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "category";

interface MeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGraph: string | null;
  selectedGraphName?: string;
  identifier: string;
  object: string;
  onSuccess: () => void;
  /**
   * The entity category to search target entities within. Entity search is
   * category-scoped on the current backend; without one, the "Target
   * Entity" search field has nothing to search and stays empty.
   */
  entityCategory?: string;
}

export const MeasurementDialog = ({
  open,
  onOpenChange,
  selectedGraph,
  selectedGraphName,
  identifier,
  object,
  onSuccess,
  entityCategory,
}: MeasurementDialogProps) => {
  const [createMeasurement] = useCreateMeasurementMutation({});
  const [createMeasurementCategory] = useCreateMeasurementCategoryMutation({});
  const [listMeasurementCategories] = useListMeasurmentCategoryLazyQuery();
  const [ensureStructure] = useEnsureStructureMutation();
  const [searchEntities] = useSearchEntitiesLazyQuery();

  const searchTargetEntities = async (x: {
    variables: { search?: string; values?: string[] };
  }) => {
    if (!entityCategory) {
      return { data: { options: [] } };
    }
    const result = await searchEntities({
      variables: {
        category: entityCategory,
        search: x.variables.search,
        values: x.variables.values,
      },
    });
    return { data: result.data ? { options: result.data.options } : undefined };
  };

  const measurementForm = useForm({
    defaultValues: {
      measurementCategory: "",
      entity: "",
      newCategoryName: "",
      newCategoryDescription: "",
    },
  });

  // Create a filtered search function for measurement categories based on selected graph
  const searchMeasurementCategoriesForGraph = async (x: {
    variables: { search?: string; values?: string[] };
  }) => {
    if (!selectedGraph) {
      return { data: { options: [] } };
    }

    // Use the list query with graph filtering
    const result = await listMeasurementCategories({
      variables: {
        filters: {
          graph: { id: selectedGraph },
          search: x.variables.search,
          ids: x.variables.values,
        },
        pagination: { limit: 10 },
      },
    });

    if (result.data) {
      // Transform the data to match the expected format
      const options = result.data.measurementCategories.map((cat) => ({
        value: cat.id,
        label: cat.label,
      }));
      return { data: { options } };
    }

    return { data: { options: [] } };
  };

  const handleMeasurementSubmit = async (data: {
    measurementCategory?: string;
    entity?: string;
    newCategoryName?: string;
    newCategoryDescription?: string;
  }) => {
    if (!selectedGraph) return;

    try {
      let categoryId = data.measurementCategory;

      // If creating a new category
      if (!categoryId && data.newCategoryName) {
        const newCategory = await createMeasurementCategory({
          variables: {
            input: {
              key: slugify(data.newCategoryName),
              label: data.newCategoryName,
              description: data.newCategoryDescription || "No description",
              graph: selectedGraph,
              source: {
                // Connect to structures with any tags/categories initially
              },
              target: {
                // Allow connection to any entity initially
              },
            },
          },
        });
        categoryId = newCategory.data?.createMeasurementCategory.id;
      }

      if (categoryId && data.entity) {
        // Ensure the structure (identifier + object) exists so we have an id
        // to use as the measurement's source.
        const structure = await ensureStructure({
          variables: {
            input: {
              identifier,
              object,
              graph: selectedGraph,
            },
          },
        });

        if (!structure.data?.ensureStructure) {
          console.error("Failed to ensure structure");
          return;
        }

        // Create the measurement connection
        await createMeasurement({
          variables: {
            input: {
              sourceId: structure.data.ensureStructure.id,
              category: categoryId,
              targetId: data.entity,
            },
          },
        });

        // Reset form and close dialog
        measurementForm.reset();
        onOpenChange(false);
        onSuccess();
      } else {
        console.error("Missing required fields: categoryId or entity");
      }
    } catch (error) {
      console.error("Error creating measurement:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect Structure with Measurement</DialogTitle>
          <DialogDescription>
            Select an existing measurement category or create a new one to
            connect this structure to an entity in{" "}
            <strong>{selectedGraphName || "the selected graph"}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...measurementForm}>
          <form
            onSubmit={measurementForm.handleSubmit(handleMeasurementSubmit)}
            className="space-y-4"
          >
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Use Existing</TabsTrigger>
                <TabsTrigger value="new">Create New</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4">
                <GraphQLSearchField
                  name="measurementCategory"
                  label="Measurement Category"
                  description="Select an existing measurement category for this graph"
                  searchQuery={searchMeasurementCategoriesForGraph}
                />
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <StringField
                  name="newCategoryName"
                  label="Category Name"
                  description="Name for the new measurement category"
                />
                <ParagraphField
                  name="newCategoryDescription"
                  label="Description"
                  description="Describe what this measurement category represents"
                />
              </TabsContent>
            </Tabs>

            <GraphQLSearchField
              name="entity"
              label="Target Entity"
              description="Search and select the entity to measure"
              searchQuery={searchTargetEntities}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Connection</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
