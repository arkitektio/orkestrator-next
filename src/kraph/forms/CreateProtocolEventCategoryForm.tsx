import { ChoicesField } from "@/components/fields/ChoicesField";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { StringField } from "@/components/fields/StringField";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { editor } from "@/plate/plugins";
import { Plate, usePlateEditor } from "@udecode/plate-common/react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CreateProtocolEventCategoryMutationVariables,
  MetricKind,
  useCreateProtocolEventCategoryMutation,
  useSearchEntityCategoryLazyQuery,
  useSearchReagentCategoryLazyQuery,
  useSearchTagsLazyQuery
} from "../api/graphql";
import { RoleProvider } from "../providers/RoleProvider";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { useDialog } from "@/app/dialog";

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "Hello, World!" }],
  },
];

export const TForm = (props: { graph?: string }) => {
  const [create] = useCreateProtocolEventCategoryMutation({
    refetchQueries: ["GetGraph"],
  });

  const dialog = useDialog()


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
        variableDefinitions: []
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
  const [searchReagentCategory] = useSearchReagentCategoryLazyQuery()

  const sourceArray = useFieldArray({
    control: myform.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "sourceEntityRoles", // unique name for your Field Array
  });

  const targetArray = useFieldArray({
    control: myform.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "targetEntityRoles", // unique name for your Field Array
  });

  const targetReagentArray = useFieldArray({
    control: myform.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "targetReagentRoles", // unique name for your Field Array
  });

  const sourceReagentArray = useFieldArray({
    control: myform.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "sourceReagentRoles", // unique name for your Field Array
  });

  const variableDefinitionsArray = useFieldArray({
    control: myform.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "variableDefinitions", // unique name for your Field Array
  });

  return (
    <>
      <Form {...myform}>
        <form
          onSubmit={myform.handleSubmit(onUpdate)}
          className="flex flex-col gap-4 p-6 min-w-[90vw] min-h-[90vh]"
        >
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
          <div className="flex grow flex-col ">
            <RoleProvider roles={roles}>
              <TooltipProvider>
                <Plate editor={plateEditor}>
                  <FixedToolbar>
                    <FixedToolbarButtons />
                    <Button type="submit" variant={"outline"}>
                      Save
                    </Button>
                  </FixedToolbar>



                  <div className="grid grid-cols-12  w-full h-full flex-grow flex rounded-lg">
                    <div className="col-span-10 h-full flex">
                      <Editor className="rounded-xs border-0 mt-0 ring-0 h-full " />
                    </div>
                    <div className="col-span-2  flex-col bg-background p-3">
                      <div className="flex flex-col p-2">
                        <div className="text-xs mb-2 items-center w-full flex justify-center">
                          Ins
                        </div>
                        <div className="flex flex-col gap-4">
                          {sourceArray.fields.map((item, index) => (
                            <Card
                              key={item.id}
                              className="p-3  gap-2 flex-col flex group"
                            >
                              <StringField
                                name={`sourceEntityRoles.${index}.role`}
                                label="Role"
                                description="Which role does the entity play?"
                              />
                              <div className="group-hover:block group-hover:opacity-100 opacity-0 transition-opacity hidden">
                                <GraphQLListSearchField
                                  name={`sourceEntityRoles.${index}.categoryDefinition.tagFilters`}
                                  label="Tag Filters"
                                  searchQuery={searchTags}
                                  description="Filters for the entity's tags."
                                />
                                <GraphQLListSearchField
                                  name={`sourceEntityRoles.${index}.categoryDefinition.categoryFilters`}
                                  label="Category Filters"
                                  searchQuery={searchEntityCategory}
                                  description="Filters for the entity's categories."
                                />
                                <StringField
                                  name={`sourceEntityRoles.${index}.label`}
                                  label="Label"
                                  description="Which role does the entity play?"
                                />
                                <StringField
                                  name={`sourceEntityRoles.${index}.description`}
                                  label="Description"
                                  description="What describes this role the best"
                                />
                                <GraphQLSearchField
                                  name={`sourceEntityRoles.${index}.createCategory`}
                                  label="Create Category"
                                  searchQuery={searchEntityCategory}
                                  description="If the user is selecting create Category, which category should be used"
                                />

                                <Button
                                  type="button"
                                  onClick={() => targetArray.remove(index)}
                                  variant={"destructive"}
                                >
                                  Delete
                                </Button>
                              </div>
                            </Card>
                          ))}
                          <Button
                            className="h-full max-w-xs"
                            type="button"
                            onClick={() =>
                              sourceArray.append({
                                role: "new",
                                categoryDefinition: {
                                  tagFilters: [],
                                  categoryFilters: [],
                                },
                              })
                            }
                            variant={"outline"}
                          >
                            Add Source Entity
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="text-xs mb-2 items-center w-full flex justify-center">
                          Targets
                        </div>
                        <div className="flex flex-col gap-4">
                          {targetArray.fields.map((item, index) => (
                            <Card
                              key={item.id}
                              className="p-3 max-w-lg gap-2 flex-col flex group"
                            >
                              <StringField
                                name={`targetEntityRoles.${index}.role`}
                                label="Role"
                                description="Which role does the entity play?"
                              />
                              <div className="group-hover:block group-hover:opacity-100 opacity-0 transition-opacity hidden">
                                <GraphQLListSearchField
                                  name={`targetEntityRoles.${index}.categoryDefinition.tagFilters`}
                                  label="Tag Filters"
                                  searchQuery={searchTags}
                                  description="Filters for the entity's tags."
                                />
                                <GraphQLListSearchField
                                  name={`targetEntityRoles.${index}.categoryDefinition.categoryFilters`}
                                  label="Category Filters"
                                  searchQuery={searchEntityCategory}
                                  description="Filters for the entity's categories."
                                />
                                <StringField
                                  name={`targetEntityRoles.${index}.label`}
                                  label="Label"
                                  description="Which role does the entity play?"
                                />
                                <StringField
                                  name={`targetEntityRoles.${index}.description`}
                                  label="Description"
                                  description="What describes this role the best"
                                />
                                <GraphQLSearchField
                                  name={`targetEntityRoles.${index}.createCategory`}
                                  label="Create Category"
                                  searchQuery={searchEntityCategory}
                                  description="If the user is selecting create Category, which category should be used"
                                />

                                <Button
                                  type="button"
                                  onClick={() => targetArray.remove(index)}
                                  variant={"destructive"}
                                >
                                  Delete
                                </Button>
                              </div>
                            </Card>
                          ))}
                          <Button
                            className="h-full max-w-xs"
                            type="button"
                            onClick={() =>
                              targetArray.append({
                                role: "new",
                                categoryDefinition: {
                                  tagFilters: [],
                                  categoryFilters: [],
                                },
                              })
                            }
                            variant={"ghost"}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-xs mb-2 items-center w-full flex justify-center">
                          Target Reagents
                        </div>
                        <div className="flex flex-col gap-4">
                          {targetReagentArray.fields.map((item, index) => (
                            <Card
                              key={item.id}
                              className="p-3 max-w-lg gap-2 flex-col flex group"
                            >
                              <StringField
                                name={`targetReagentRoles.${index}.role`}
                                label="Role"
                                description="Which role does the entity play?"
                              />
                              <div className="group-hover:block group-hover:opacity-100 opacity-0 transition-opacity hidden">
                                <GraphQLListSearchField
                                  name={`targetReagentRoles.${index}.categoryDefinition.tagFilters`}
                                  label="Tag Filters"
                                  searchQuery={searchTags}
                                  description="Filters for the entity's tags."
                                />
                                <GraphQLListSearchField
                                  name={`targetReagentRoles.${index}.categoryDefinition.categoryFilters`}
                                  label="Category Filters"
                                  searchQuery={searchReagentCategory}
                                  description="Filters for the entity's categories."
                                />
                                <StringField
                                  name={`targetReagentRoles.${index}.label`}
                                  label="Label"
                                  description="Which role does the entity play?"
                                />
                                <StringField
                                  name={`targetReagentRoles.${index}.description`}
                                  label="Description"
                                  description="What describes this role the best"
                                />

                                <Button
                                  type="button"
                                  onClick={() => targetArray.remove(index)}
                                  variant={"destructive"}
                                >
                                  Delete
                                </Button>
                              </div>
                            </Card>
                          ))}
                          <Button
                            className="h-full max-w-xs"
                            type="button"
                            onClick={() =>
                              targetArray.append({
                                role: "new",
                                categoryDefinition: {
                                  tagFilters: [],
                                  categoryFilters: [],
                                },
                              })
                            }
                            variant={"ghost"}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-xs mb-2 items-center w-full flex justify-center">
                          Source Reagents
                        </div>
                        <div className="flex flex-col gap-4">
                          {sourceReagentArray.fields.map((item, index) => (
                            <Card
                              key={item.id}
                              className="p-3 max-w-lg gap-2 flex-col flex group"
                            >
                              <StringField
                                name={`sourceReagentRoles.${index}.role`}
                                label="Role"
                                description="Which role does the entity play?"
                              />
                              <div className="group-hover:block group-hover:opacity-100 opacity-0 transition-opacity hidden">
                                <GraphQLListSearchField
                                  name={`sourceReagentRoles.${index}.categoryDefinition.tagFilters`}
                                  label="Tag Filters"
                                  searchQuery={searchTags}
                                  description="Filters for the entity's tags."
                                />
                                <GraphQLListSearchField
                                  name={`sourceReagentRoles.${index}.categoryDefinition.categoryFilters`}
                                  label="Category Filters"
                                  searchQuery={searchReagentCategory}
                                  description="Filters for the entity's categories."
                                />
                                <StringField
                                  name={`sourceReagentRoles.${index}.label`}
                                  label="Label"
                                  description="Which role does the entity play?"
                                />
                                <StringField
                                  name={`sourceReagentRoles.${index}.description`}
                                  label="Description"
                                  description="What describes this role the best"
                                />

                                <Button
                                  type="button"
                                  onClick={() => targetArray.remove(index)}
                                  variant={"destructive"}
                                >
                                  Delete
                                </Button>
                              </div>
                            </Card>
                          ))}
                          <Button
                            className="h-full max-w-xs"
                            type="button"
                            onClick={() =>
                              sourceReagentArray.append({
                                role: "new",
                                categoryDefinition: {
                                  tagFilters: [],
                                  categoryFilters: [],
                                },
                              })
                            }
                            variant={"ghost"}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-xs mb-2 items-center w-full flex justify-center">
                          Variable Definitions
                        </div>
                        <div className="flex flex-col gap-4">
                          {variableDefinitionsArray.fields.map(
                            (item, index) => (
                              <Card
                                key={item.id}
                                className="p-3 max-w-lg gap-2 flex-col flex group"
                              >
                                <StringField
                                  name={`variableDefinitions.${index}.param`}
                                  label="Role"
                                  description="Which role does the entity play?"
                                />
                                <div className="group-hover:block group-hover:opacity-100 opacity-0 transition-opacity hidden">
                                  <ChoicesField
                                    name={`variableDefinitions.${index}.valueKind`}
                                    label="Tag Filters"
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
                                    description="Filters for the entity's tags."
                                  />
                                  <StringField
                                    name={`variableDefinitions.${index}.description`}
                                    label="Description"
                                    description="Which role does the entity play?"
                                  />
                                  <StringField
                                    name={`variableDefinitions.${index}.label`}
                                    label="Label"
                                    description="Which role does the entity play?"
                                  />

                                  <Button
                                    type="button"
                                    onClick={() =>
                                      variableDefinitionsArray.remove(index)
                                    }
                                    variant={"destructive"}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </Card>
                            ),
                          )}
                          <Button
                            className="h-full max-w-xs"
                            type="button"
                            onClick={() =>
                              variableDefinitionsArray.append({
                                param: "new",
                                valueKind: MetricKind.String,
                                label: "",
                                description: "",
                              })
                            }
                            variant={"ghost"}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <FloatingToolbar>
                    <FloatingToolbarButtons />
                  </FloatingToolbar>
                  <CommentsPopover />
                </Plate>
              </TooltipProvider>
            </RoleProvider>
          </div>
          <Button type="submit" variant={"outline"}>
            Save
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TForm;