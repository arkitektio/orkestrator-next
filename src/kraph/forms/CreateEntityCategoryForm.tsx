import { useGraphQlFormDialog } from "@/components/dialog/FormDialog";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { ParagraphField } from "@/components/fields/ParagraphField";
import { StringField } from "@/components/fields/StringField";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import {
  CreateEntityCategoryMutationVariables,
  GetGraphDocument,
  ListEntitiesDocument,
  MetricKind,
  useCreateEntityCategoryMutation,
  useSearchGraphsLazyQuery,
} from "../api/graphql";

const PropertyItem = ({
  index,
  remove,
}: {
  index: number;
  remove: (index: number) => void;
}) => {
  const { watch, control } = useFormContext();
  const key = watch(`propertyDefinitions.${index}.key`);
  const kind = watch(`propertyDefinitions.${index}.valueKind`);

  return (
    <AccordionItem value={`item-${index}`}>
      <AccordionTrigger className="hover:no-underline py-2">
        <div className="flex items-center gap-2 w-full">
          <span className="font-mono text-xs bg-muted px-1 rounded">
            {key || "New Property"}
          </span>
          <span className="text-xs text-muted-foreground">{kind}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-2 p-1">
          <StringField
            name={`propertyDefinitions.${index}.key`}
            label="Key"
            description="The key of the property (snake_case)"
          />
          <FormField
            control={control}
            name={`propertyDefinitions.${index}.valueKind`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(MetricKind).map((kind) => (
                      <SelectItem key={kind} value={kind}>
                        {kind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <StringField
            name={`propertyDefinitions.${index}.label`}
            label="Label"
            description="Human readable label"
          />
          <ParagraphField
            name={`propertyDefinitions.${index}.description`}
            label="Description"
          />
          <div className="col-span-2 flex gap-4 items-center border p-2 rounded-md">
            <FormField
              control={control}
              name={`propertyDefinitions.${index}.optional`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Optional</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`propertyDefinitions.${index}.searchable`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Searchable</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`propertyDefinitions.${index}.useAsLabel`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Use as Label</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 flex justify-end mt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
              type="button"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const PropertyDefinitions = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "propertyDefinitions",
  });
  const [expanded, setExpanded] = useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col gap-2 mt-4 border rounded-md p-4 h-full overflow-auto bg-slate-800">
      <div className="flex justify-between items-center">
        <Label>Properties</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            append({ key: "new_property", valueKind: MetricKind.String });
            setExpanded(`item-${fields.length}`);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Property
        </Button>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={expanded}
        onValueChange={setExpanded}
      >
        {fields.map((field, index) => (
          <PropertyItem key={field.id} index={index} remove={remove} />
        ))}
      </Accordion>
      {fields.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4">
          No properties defined.
        </div>
      )}
    </div>
  );
};



export default (props: Partial<CreateEntityCategoryMutationVariables["input"]>) => {
  const [add] = useCreateEntityCategoryMutation({
    refetchQueries: [props.graph ? { query: GetGraphDocument, variables: { id: props.graph } } : ListEntitiesDocument],

  });

  const dialog = useGraphQlFormDialog(add);

  const form = useForm<CreateEntityCategoryMutationVariables["input"]>({
    defaultValues: {
      ...props,
    },
  });

  const [search] = useSearchGraphsLazyQuery();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            dialog({
              variables: {
                input: {
                  ...data,
                },
              },
            });
          })}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 flex-col gap-1 flex">
              {!props.graph && (
                <>
                  <GraphQLSearchField
                    label="Graph"
                    name="graph"
                    description="What graph do you want to add this expression to?"
                    searchQuery={search}
                  />
                </>
              )}
              <StringField
                label="Label"
                name="label"
                description="Whats the expression? (e.g. 'Person' or 'Connected to')"
              />
              <ParagraphField
                label="Description"
                name="description"
                description="What describes your expression the best? (e.g. 'A person is a human being')"
              />
              <StringField
                label="PURL"
                name="purl"
                description="What is the PURL of this expression?"
              />
            </div>
            <div className="col-span-1 flex-col gap-1 flex ">
              <PropertyDefinitions />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
