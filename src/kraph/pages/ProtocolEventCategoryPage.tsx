import { Plate } from "@udecode/plate-common/react";

import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { StringField } from "@/components/fields/StringField";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  KraphNaturalEventCategory,
  KraphProtocolStepTemplate,
} from "@/linkers";
import { editor } from "@/plate/plugins";
import {
  useEditorReadOnly,
  useEditorRef,
  usePlateEditor,
} from "@udecode/plate-common/react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  NaturalEventCategoryFragment,
  ProtocolEventCategoryFragment,
  UpdateNaturalEventCategoryMutationVariables,
  UpdateProtocolEventCategoryMutationVariables,
  useGetNaturalEventCategoryQuery,
  useGetProtocolEventCategoryQuery,
  useSearchEntityCategoryLazyQuery,
  useSearchTagsLazyQuery,
  useUpdateNaturalEventCategoryMutation,
  useUpdateProtocolEventCategoryMutation,
} from "../api/graphql";
import { Card } from "@/components/ui/card";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { DragZone } from "@/components/upload/drag";

export type IRepresentationScreenProps = {};

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "Hello, World!" }],
  },
];

export const SafeButton = ({
  naturalEventCategory,
}: {
  naturalEventCategory: NaturalEventCategoryFragment;
}) => {
  const ref = useEditorRef();
  const [update] = useUpdateProtocolEventCategoryMutation();
  const readOnly = useEditorReadOnly();
  const [saving, setSaving] = useState(false);

  const onClick = () => {
    console.log("serialized");
    console.log(ref);
    setSaving(true);

    update({
      variables: {
        input: { plateChildren: ref?.children, ...naturalEventCategory },
      },
    }).then(() => {
      setSaving(false);
    });
  };

  return (
    <>
      {!readOnly && (
        <Button
          onClick={onClick}
          disabled={saving}
          variant={"outline"}
          className="mr-2"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      )}
    </>
  );
};

export function PlateEditor({
  naturalEventCategory,
}: {
  naturalEventCategory: NaturalEventCategoryFragment;
}) {
  const plateEditor = usePlateEditor({
    ...editor,
    value: naturalEventCategory.plateChildren || initialValue,
  });

  return (
    <Plate editor={plateEditor}>
      <FixedToolbar>
        <FixedToolbarButtons />
        <SafeButton naturalEventCategory={naturalEventCategory} />
      </FixedToolbar>

      <Editor />

      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
      <CommentsPopover />
    </Plate>
  );
}

export function PlateDisplay({ plates }: { plates: any[] }) {
  const plateEditor = usePlateEditor({
    ...editor,
    value: plates,
  });
  return (
    <TooltipProvider>
      <Plate editor={plateEditor}>
        <Editor
          className="rounded-xs border-0 mt-0 ring-0 h-full w-full"
          disabled={true}
        />

        <CommentsPopover />
      </Plate>
    </TooltipProvider>
  );
}

export const RoleDefinitionCreator = ({
  protocolEventCategory,
}: {
  protocolEventCategory: ProtocolEventCategoryFragment;
}) => {
  const [update] = useUpdateProtocolEventCategoryMutation();

  const plateEditor = usePlateEditor({
    ...editor,
    value: protocolEventCategory.plateChildren || initialValue,
  });

  const onUpdate = (data) => {
    update({
      variables: {
        input: { ...data, plateChildren: plateEditor.children },
      },
    });
  };

  const myform = useForm<UpdateProtocolEventCategoryMutationVariables["input"]>(
    {
      defaultValues: {
        id: protocolEventCategory.id,
        label: protocolEventCategory.label,
        description: protocolEventCategory.description,
        sourceEntityRoles: protocolEventCategory.sourceEntityRoles.map(
          (role) => ({
            ...role,
            categoryDefinition: {
              ...role.categoryDefinition,
              __typename: undefined,
            },
            __typename: undefined,
          }),
        ),
        targetEntityRoles: protocolEventCategory.targetEntityRoles.map(
          (role) => ({
            ...role,
            categoryDefinition: {
              ...role.categoryDefinition,
              __typename: undefined,
            },
            __typename: undefined,
          }),
        ),
        sourceReagentRoles: protocolEventCategory.sourceReagentRoles.map(
          (role) => ({
            ...role,
            categoryDefinition: {
              ...role.categoryDefinition,
              __typename: undefined,
            },
            __typename: undefined,
          }),
        ),
        targetReagentRoles: protocolEventCategory.targetReagentRoles.map(
          (role) => ({
            ...role,
            categoryDefinition: {
              ...role.categoryDefinition,
              __typename: undefined,
            },
            __typename: undefined,
          }),
        ),
      },
    },
  );

  const [searchTags] = useSearchTagsLazyQuery();
  const [searchEntityCategory] = useSearchEntityCategoryLazyQuery();

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

  return (
    <>
      <Form {...myform}>
        <form
          onSubmit={myform.handleSubmit(onUpdate)}
          className="flex flex-row gap-4 p-6 h-full"
        >
          <div className="flex grow flex-col ">
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
                              <GraphQLSearchField
                                name={`sourceEntityRoles.${index}.categoryDefinition.tagFilters`}
                                label="Tag Filters"
                                searchQuery={searchTags}
                                description="Filters for the entity's tags."
                              />
                              <GraphQLSearchField
                                name={`sourceEntityRoles.${index}.categoryDefinition.categoryFilters`}
                                label="Category Filters"
                                searchQuery={searchEntityCategory}
                                description="Filters for the entity's categories."
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
                              <GraphQLSearchField
                                name={`targetEntityRoles.${index}.categoryDefinition.tagFilters`}
                                label="Tag Filters"
                                searchQuery={searchTags}
                                description="Filters for the entity's tags."
                              />
                              <GraphQLSearchField
                                name={`targetEntityRoles.${index}.categoryDefinition.categoryFilters`}
                                label="Category Filters"
                                searchQuery={searchEntityCategory}
                                description="Filters for the entity's categories."
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
                              <GraphQLSearchField
                                name={`targetReagentRoles.${index}.categoryDefinition.tagFilters`}
                                label="Tag Filters"
                                searchQuery={searchTags}
                                description="Filters for the entity's tags."
                              />
                              <GraphQLSearchField
                                name={`targetReagentRoles.${index}.categoryDefinition.categoryFilters`}
                                label="Category Filters"
                                searchQuery={searchEntityCategory}
                                description="Filters for the entity's categories."
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
                              <GraphQLSearchField
                                name={`sourceReagentRoles.${index}.categoryDefinition.tagFilters`}
                                label="Tag Filters"
                                searchQuery={searchTags}
                                description="Filters for the entity's tags."
                              />
                              <GraphQLSearchField
                                name={`sourceReagentRoles.${index}.categoryDefinition.categoryFilters`}
                                label="Category Filters"
                                searchQuery={searchEntityCategory}
                                description="Filters for the entity's categories."
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
                  </div>
                </div>
                <FloatingToolbar>
                  <FloatingToolbarButtons />
                </FloatingToolbar>
                <CommentsPopover />
              </Plate>
            </TooltipProvider>
          </div>
        </form>
      </Form>
    </>
  );
};

export default asDetailQueryRoute(
  useGetProtocolEventCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphUpload();
    const [update] = useUpdateProtocolEventCategoryMutation();

    const resolve = useResolve();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await update({
          variables: {
            input: {
              id: data.protocolEventCategory.id,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    return (
      <KraphNaturalEventCategory.ModelPage
        title={data?.protocolEventCategory?.label}
        object={data.protocolEventCategory.id}
        actions={
          <KraphProtocolStepTemplate.Actions
            object={data.protocolEventCategory.id}
          />
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphProtocolStepTemplate.Komments
                  object={data.protocolEventCategory.id}
                />
              ),
            }}
          />
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.protocolEventCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.protocolEventCategory.description}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.protocolEventCategory?.store?.presignedUrl && (
              <img
                src={resolve(data.protocolEventCategory?.store.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>

        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <RoleDefinitionCreator
          protocolEventCategory={data.protocolEventCategory}
        />
      </KraphNaturalEventCategory.ModelPage>
    );
  },
);
