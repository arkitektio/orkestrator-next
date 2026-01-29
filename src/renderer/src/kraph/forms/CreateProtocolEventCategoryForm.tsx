import { ChoicesField } from "@/components/fields/ChoicesField";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { StringField } from "@/components/fields/StringField";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { editor } from "@/plate/plugins";
import { Plate, usePlateEditor } from "@udecode/plate-common/react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDialog } from "@/app/dialog";
import {
  CreateProtocolEventCategoryMutationVariables,
  MetricKind,
  useCreateProtocolEventCategoryMutation,
  useSearchEntityCategoryLazyQuery,
  useSearchReagentCategoryLazyQuery,
  useSearchTagsLazyQuery,
} from "../api/graphql";
import { RoleProvider } from "../providers/RoleProvider";

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "Hello, World!" }],
  },
];

export const TForm = (props: { graph: string }) => {
  const [create] = useCreateProtocolEventCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useDialog();

  const plateEditor = usePlateEditor({
    ...editor,
    value: initialValue,
  });

  const onUpdate = (data) => {
    create({
      variables: {
        input: { ...data, plateChildren: plateEditor.children },
      },
    }).then(() => dialog.closeDialog());
  };

  const myform = useForm<CreateProtocolEventCategoryMutationVariables["input"]>(
    {
      defaultValues: {
        graph: props.graph,
        label: "No Label",
        description: "Description",
        sourceEntityRoles: [],
        targetEntityRoles: [],
        sourceReagentRoles: [],
        targetReagentRoles: [],
        variableDefinitions: [],
      },
    },
  );

  const sourceEntityRoles = myform.watch("sourceEntityRoles");
  const targetEntityRoles = myform.watch("targetEntityRoles");
  const sourceReagentRoles = myform.watch("sourceReagentRoles");
  const targetReagentRoles = myform.watch("targetReagentRoles");
  const variableDefinitions = myform.watch("variableDefinitions");

  const roles = useMemo(() => {
    return [
      ...(sourceEntityRoles?.map((role) => ({
        label: role.role,
        value: role.role,
      })) || []),
      ...(targetEntityRoles?.map((role) => ({
        label: role.role,
        value: role.role,
      })) || []),
      ...(sourceReagentRoles?.map((role) => ({
        label: role.role,
        value: role.role,
      })) || []),
      ...(targetReagentRoles?.map((role) => ({
        label: role.role,
        value: role.role,
      })) || []),
      ...(variableDefinitions?.map((role) => ({
        label: role.param,
        value: role.param,
      })) || []),
    ];
  }, [
    sourceEntityRoles,
    targetEntityRoles,
    sourceReagentRoles,
    targetReagentRoles,
    variableDefinitions,
  ]);

  const [searchTags] = useSearchTagsLazyQuery();
  const [searchEntityCategory] = useSearchEntityCategoryLazyQuery();
  const [searchReagentCategory] = useSearchReagentCategoryLazyQuery();

  const sourceArray = useFieldArray({
    control: myform.control,
    name: "sourceEntityRoles",
  });

  const targetArray = useFieldArray({
    control: myform.control,
    name: "targetEntityRoles",
  });

  const targetReagentArray = useFieldArray({
    control: myform.control,
    name: "targetReagentRoles",
  });

  const sourceReagentArray = useFieldArray({
    control: myform.control,
    name: "sourceReagentRoles",
  });

  const variableDefinitionsArray = useFieldArray({
    control: myform.control,
    name: "variableDefinitions",
  });

  return (
    <Form {...myform}>
      <form
        onSubmit={myform.handleSubmit(onUpdate)}
        className="flex flex-col h-full w-full overflow-hidden"
      >
        <div className="flex gap-4 p-4 border-b items-end">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <StringField
              name={`label`}
              label="Label"
              description="Which label for the protocol"
            />
            <StringField
              name={`description`}
              label="Description"
              description="Which description for the protocol"
            />
          </div>
          <Button type="submit" variant={"default"}>
            Save
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <RoleProvider roles={roles}>
            <TooltipProvider>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={60} minSize={30}>
                  <Plate editor={plateEditor}>
                    <div className="flex flex-col h-full">
                      <FixedToolbar>
                        <FixedToolbarButtons />
                      </FixedToolbar>
                      <div className="flex-1 overflow-y-auto p-4" id="scroll-container">
                        <Editor className="min-h-full" />
                      </div>
                      <FloatingToolbar>
                        <FloatingToolbarButtons />
                      </FloatingToolbar>
                      <CommentsPopover />
                    </div>
                  </Plate>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={30}>
                  <Tabs defaultValue="entities" className="h-full flex flex-col">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-2">
                      <TabsTrigger
                        value="entities"
                        className="data-[state=active]:bg-muted"
                      >
                        Entities
                      </TabsTrigger>
                      <TabsTrigger
                        value="reagents"
                        className="data-[state=active]:bg-muted"
                      >
                        Reagents
                      </TabsTrigger>
                      <TabsTrigger
                        value="variables"
                        className="data-[state=active]:bg-muted"
                      >
                        Variables
                      </TabsTrigger>
                    </TabsList>
                    <ScrollArea className="flex-1">
                      <div className="p-4">
                        <TabsContent value="entities" className="mt-0">
                          <Accordion
                            type="multiple"
                            defaultValue={["source", "target"]}
                          >
                            <AccordionItem value="source">
                              <AccordionTrigger>Source Entities</AccordionTrigger>
                              <AccordionContent className="flex flex-col gap-2">
                                {sourceArray.fields.map((item, index) => (
                                  <Card key={item.id} className="p-3">
                                    <div className="flex flex-col gap-2">
                                      <StringField
                                        name={`sourceEntityRoles.${index}.role`}
                                        label="Role"
                                        description="Role name"
                                      />
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="details" className="border-none">
                                          <AccordionTrigger className="py-2 text-xs">
                                            Details
                                          </AccordionTrigger>
                                          <AccordionContent className="flex flex-col gap-2 pt-2">
                                            <StringField
                                              name={`sourceEntityRoles.${index}.label`}
                                              label="Label"
                                            />
                                            <StringField
                                              name={`sourceEntityRoles.${index}.description`}
                                              label="Description"
                                            />
                                            <GraphQLListSearchField
                                              name={`sourceEntityRoles.${index}.categoryDefinition.tagFilters`}
                                              label="Tag Filters"
                                              searchQuery={searchTags}
                                            />
                                            <GraphQLListSearchField
                                              name={`sourceEntityRoles.${index}.categoryDefinition.categoryFilters`}
                                              label="Category Filters"
                                              searchQuery={searchEntityCategory}
                                            />
                                            <GraphQLSearchField
                                              name={`sourceEntityRoles.${index}.createCategory`}
                                              label="Create Category"
                                              searchQuery={searchEntityCategory}
                                              description="Category to use when creating"
                                            />
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                      <Button
                                        type="button"
                                        onClick={() => sourceArray.remove(index)}
                                        variant="destructive"
                                        size="sm"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </Card>
                                ))}
                                <Button
                                  type="button"
                                  onClick={() =>
                                    sourceArray.append({
                                      role: "new_source",
                                      categoryDefinition: {
                                        tagFilters: [],
                                        categoryFilters: [],
                                      },
                                    })
                                  }
                                  variant="outline"
                                  size="sm"
                                >
                                  Add Source Entity
                                </Button>
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="target">
                              <AccordionTrigger>Target Entities</AccordionTrigger>
                              <AccordionContent className="flex flex-col gap-2">
                                {targetArray.fields.map((item, index) => (
                                  <Card key={item.id} className="p-3">
                                    <div className="flex flex-col gap-2">
                                      <StringField
                                        name={`targetEntityRoles.${index}.role`}
                                        label="Role"
                                        description="Role name"
                                      />
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="details" className="border-none">
                                          <AccordionTrigger className="py-2 text-xs">
                                            Details
                                          </AccordionTrigger>
                                          <AccordionContent className="flex flex-col gap-2 pt-2">
                                            <StringField
                                              name={`targetEntityRoles.${index}.label`}
                                              label="Label"
                                            />
                                            <StringField
                                              name={`targetEntityRoles.${index}.description`}
                                              label="Description"
                                            />
                                            <GraphQLListSearchField
                                              name={`targetEntityRoles.${index}.categoryDefinition.tagFilters`}
                                              label="Tag Filters"
                                              searchQuery={searchTags}
                                            />
                                            <GraphQLListSearchField
                                              name={`targetEntityRoles.${index}.categoryDefinition.categoryFilters`}
                                              label="Category Filters"
                                              searchQuery={searchEntityCategory}
                                            />
                                            <GraphQLSearchField
                                              name={`targetEntityRoles.${index}.createCategory`}
                                              label="Create Category"
                                              searchQuery={searchEntityCategory}
                                              description="Category to use when creating"
                                            />
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                      <Button
                                        type="button"
                                        onClick={() => targetArray.remove(index)}
                                        variant="destructive"
                                        size="sm"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </Card>
                                ))}
                                <Button
                                  type="button"
                                  onClick={() =>
                                    targetArray.append({
                                      role: "new_target",
                                      categoryDefinition: {
                                        tagFilters: [],
                                        categoryFilters: [],
                                      },
                                    })
                                  }
                                  variant="outline"
                                  size="sm"
                                >
                                  Add Target Entity
                                </Button>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TabsContent>

                        <TabsContent value="reagents" className="mt-0">
                          <Accordion
                            type="multiple"
                            defaultValue={["source", "target"]}
                          >
                            <AccordionItem value="source">
                              <AccordionTrigger>Source Reagents</AccordionTrigger>
                              <AccordionContent className="flex flex-col gap-2">
                                {sourceReagentArray.fields.map((item, index) => (
                                  <Card key={item.id} className="p-3">
                                    <div className="flex flex-col gap-2">
                                      <StringField
                                        name={`sourceReagentRoles.${index}.role`}
                                        label="Role"
                                        description="Role name"
                                      />
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="details" className="border-none">
                                          <AccordionTrigger className="py-2 text-xs">
                                            Details
                                          </AccordionTrigger>
                                          <AccordionContent className="flex flex-col gap-2 pt-2">
                                            <StringField
                                              name={`sourceReagentRoles.${index}.label`}
                                              label="Label"
                                            />
                                            <StringField
                                              name={`sourceReagentRoles.${index}.description`}
                                              label="Description"
                                            />
                                            <GraphQLListSearchField
                                              name={`sourceReagentRoles.${index}.categoryDefinition.tagFilters`}
                                              label="Tag Filters"
                                              searchQuery={searchTags}
                                            />
                                            <GraphQLListSearchField
                                              name={`sourceReagentRoles.${index}.categoryDefinition.categoryFilters`}
                                              label="Category Filters"
                                              searchQuery={searchReagentCategory}
                                            />
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          sourceReagentArray.remove(index)
                                        }
                                        variant="destructive"
                                        size="sm"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </Card>
                                ))}
                                <Button
                                  type="button"
                                  onClick={() =>
                                    sourceReagentArray.append({
                                      role: "new_source_reagent",
                                      categoryDefinition: {
                                        tagFilters: [],
                                        categoryFilters: [],
                                      },
                                    })
                                  }
                                  variant="outline"
                                  size="sm"
                                >
                                  Add Source Reagent
                                </Button>
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="target">
                              <AccordionTrigger>Target Reagents</AccordionTrigger>
                              <AccordionContent className="flex flex-col gap-2">
                                {targetReagentArray.fields.map((item, index) => (
                                  <Card key={item.id} className="p-3">
                                    <div className="flex flex-col gap-2">
                                      <StringField
                                        name={`targetReagentRoles.${index}.role`}
                                        label="Role"
                                        description="Role name"
                                      />
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="details" className="border-none">
                                          <AccordionTrigger className="py-2 text-xs">
                                            Details
                                          </AccordionTrigger>
                                          <AccordionContent className="flex flex-col gap-2 pt-2">
                                            <StringField
                                              name={`targetReagentRoles.${index}.label`}
                                              label="Label"
                                            />
                                            <StringField
                                              name={`targetReagentRoles.${index}.description`}
                                              label="Description"
                                            />
                                            <GraphQLListSearchField
                                              name={`targetReagentRoles.${index}.categoryDefinition.tagFilters`}
                                              label="Tag Filters"
                                              searchQuery={searchTags}
                                            />
                                            <GraphQLListSearchField
                                              name={`targetReagentRoles.${index}.categoryDefinition.categoryFilters`}
                                              label="Category Filters"
                                              searchQuery={searchReagentCategory}
                                            />
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          targetReagentArray.remove(index)
                                        }
                                        variant="destructive"
                                        size="sm"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </Card>
                                ))}
                                <Button
                                  type="button"
                                  onClick={() =>
                                    targetReagentArray.append({
                                      role: "new_target_reagent",
                                      categoryDefinition: {
                                        tagFilters: [],
                                        categoryFilters: [],
                                      },
                                    })
                                  }
                                  variant="outline"
                                  size="sm"
                                >
                                  Add Target Reagent
                                </Button>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TabsContent>

                        <TabsContent value="variables" className="mt-0">
                          <div className="flex flex-col gap-2">
                            {variableDefinitionsArray.fields.map((item, index) => (
                              <Card key={item.id} className="p-3">
                                <div className="flex flex-col gap-2">
                                  <StringField
                                    name={`variableDefinitions.${index}.param`}
                                    label="Parameter Name"
                                  />
                                  <ChoicesField
                                    name={`variableDefinitions.${index}.valueKind`}
                                    label="Type"
                                    options={[
                                      {
                                        label: "String",
                                        value: MetricKind.String,
                                      },
                                      {
                                        label: "Int",
                                        value: MetricKind.Int,
                                      },
                                      {
                                        label: "Float",
                                        value: MetricKind.Float,
                                      },
                                    ]}
                                  />
                                  <Accordion type="single" collapsible>
                                    <AccordionItem value="details" className="border-none">
                                      <AccordionTrigger className="py-2 text-xs">
                                        Details
                                      </AccordionTrigger>
                                      <AccordionContent className="flex flex-col gap-2 pt-2">
                                        <StringField
                                          name={`variableDefinitions.${index}.label`}
                                          label="Label"
                                        />
                                        <StringField
                                          name={`variableDefinitions.${index}.description`}
                                          label="Description"
                                        />
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      variableDefinitionsArray.remove(index)
                                    }
                                    variant="destructive"
                                    size="sm"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </Card>
                            ))}
                            <Button
                              type="button"
                              onClick={() =>
                                variableDefinitionsArray.append({
                                  param: "new_param",
                                  valueKind: MetricKind.String,
                                  label: "",
                                  description: "",
                                })
                              }
                              variant="outline"
                              size="sm"
                            >
                              Add Variable
                            </Button>
                          </div>
                        </TabsContent>
                      </div>
                    </ScrollArea>
                  </Tabs>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TooltipProvider>
          </RoleProvider>
        </div>
      </form>
    </Form>
  );
};

export default TForm;
