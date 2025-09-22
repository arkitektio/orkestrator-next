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
  useListMeasurmentCategoryLazyQuery,
  useSearchEntitiesLazyQuery,
} from "../api/graphql";

interface MeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGraph: string | null;
  selectedGraphName?: string;
  identifier: string;
  object: string;
  onSuccess: () => void;
}

export const MeasurementDialog = ({
  open,
  onOpenChange,
  selectedGraph,
  selectedGraphName,
  identifier,
  object,
  onSuccess,
}: MeasurementDialogProps) => {
  const [createMeasurement] = useCreateMeasurementMutation({});
  const [createMeasurementCategory] = useCreateMeasurementCategoryMutation({});
  const [listMeasurementCategories] = useListMeasurmentCategoryLazyQuery();
  const [searchEntities] = useSearchEntitiesLazyQuery();

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
          graph: selectedGraph,
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
              label: data.newCategoryName,
              description: data.newCategoryDescription || "No description",
              graph: selectedGraph,
              structureDefinition: {
                // Connect to structures with any tags/categories initially
                tagFilters: [],
                categoryFilters: [],
              },
              entityDefinition: {
                // Allow connection to any entity initially
                tagFilters: [],
                categoryFilters: [],
              },
            },
          },
        });
        categoryId = newCategory.data?.createMeasurementCategory.id;
      }

      if (categoryId && data.entity) {
        // Create the measurement connection
        await createMeasurement({
          variables: {
            input: {
              structure: `@${identifier}/${object}`,
              category: categoryId,
              entity: data.entity,
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
              searchQuery={searchEntities}
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
