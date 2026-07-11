import { Plate } from "@udecode/plate-common/react";

import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { StringField } from "@/components/fields/StringField";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { Editor } from "@/components/plate-ui/editor";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { DragZone } from "@/components/upload/drag";
import { useKraphMediaUpload } from "@/datalayer/hooks/useKraphMediaUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphNaturalEventCategory } from "@/linkers";
import { editor } from "@/plate/plugins";
import {
  usePlateEditor
} from "@udecode/plate-common/react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  EventKind,
  NaturalEventCategoryFragment,
  UpdateNaturalEventCategoryMutationVariables,
  useGetNaturalEventCategoryQuery,
  useSearchTagsLazyQuery,
  useUpdateNaturalEventCategoryMutation
} from "../api/graphql";

export type IRepresentationScreenProps = {};

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

// Note: the backend no longer stores rich-text `plateChildren` on event
// categories, and the previous source/target "role" concept (with tag /
// category filters) has been unified into `inputs` / `outputs: EventRole[]`
// (each with a `descriptor` supporting only `tags`/`keys`/`ontotologyTerms`/
// `defaultCategoryKey`, no more free-form category filter lists). The rich
// text editor has therefore been dropped here in favor of a plain role
// editor bound to the current schema. `kind` is required by the update
// mutation but not exposed on the category fragment; natural events default
// to `Intrinsic` (as opposed to protocol events, which are `Extrinsic`).
export const RoleDefinitionCreator = ({
  naturalEventCategory,
}: {
  naturalEventCategory: NaturalEventCategoryFragment;
}) => {
  const [update] = useUpdateNaturalEventCategoryMutation();

  const onUpdate = (data: UpdateNaturalEventCategoryMutationVariables["input"]) => {
    update({
      variables: {
        input: data,
      },
    });
  };

  const myform = useForm<UpdateNaturalEventCategoryMutationVariables["input"]>({
    defaultValues: {
      id: naturalEventCategory.id,
      key: naturalEventCategory.key,
      kind: EventKind.Intrinsic,
      label: naturalEventCategory.label,
      description: naturalEventCategory.description,
      inputs: naturalEventCategory.inputs.map((role) => ({
        key: role.key,
        role: role.role,
        descriptor: {
          tags: role.descriptor.tags,
          keys: role.descriptor.keys,
          ontotologyTerms: role.descriptor.ontotologyTerms,
          defaultCategoryKey: role.descriptor.defaultCategoryKey,
        },
      })),
      outputs: naturalEventCategory.outputs.map((role) => ({
        key: role.key,
        role: role.role,
        descriptor: {
          tags: role.descriptor.tags,
          keys: role.descriptor.keys,
          ontotologyTerms: role.descriptor.ontotologyTerms,
          defaultCategoryKey: role.descriptor.defaultCategoryKey,
        },
      })),
    },
  });

  const [searchTags] = useSearchTagsLazyQuery();

  const sourceArray = useFieldArray({
    control: myform.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "inputs", // unique name for your Field Array
  });

  const targetArray = useFieldArray({
    control: myform.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "outputs", // unique name for your Field Array
  });

  return (
    <>
      <Form {...myform}>
        <form
          onSubmit={myform.handleSubmit(onUpdate)}
          className="flex flex-row gap-4 p-6 h-full"
        >
          <div className="flex grow flex-col ">
            <div className="flex justify-end mb-2">
              <Button type="submit" variant={"outline"}>
                Save
              </Button>
            </div>
            <div className="grid grid-cols-12  w-full h-full flex-grow flex rounded-lg">
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
                          name={`inputs.${index}.role`}
                          label="Role"
                          description="Which role does the entity play?"
                        />
                        <div className="group-hover:block group-hover:opacity-100 opacity-0 transition-opacity hidden">
                          <GraphQLListSearchField
                            name={`inputs.${index}.descriptor.tags`}
                            label="Tag Filters"
                            searchQuery={searchTags}
                            description="Filters for the entity's tags."
                          />

                          <Button
                            type="button"
                            onClick={() => sourceArray.remove(index)}
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
                          key: "new",
                          role: "new",
                          descriptor: {
                            tags: [],
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
                          name={`outputs.${index}.role`}
                          label="Role"
                          description="Which role does the entity play?"
                        />
                        <div className="group-hover:block group-hover:opacity-100 opacity-0 transition-opacity hidden">
                          <GraphQLListSearchField
                            name={`outputs.${index}.descriptor.tags`}
                            label="Tag Filters"
                            searchQuery={searchTags}
                            description="Filters for the entity's tags."
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
                          key: "new",
                          role: "new",
                          descriptor: {
                            tags: [],
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
          </div>
        </form>
      </Form>
    </>
  );
};

export default asDetailQueryRoute(
  useGetNaturalEventCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphMediaUpload();
    const [update] = useUpdateNaturalEventCategoryMutation();

    const resolve = useResolve();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await update({
          variables: {
            input: {
              id: data.naturalEventCategory.id,
              key: data.naturalEventCategory.key,
              kind: EventKind.Intrinsic,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    return (
      <KraphNaturalEventCategory.ModelPage
        title={data?.naturalEventCategory?.label}
        object={{ id: data.naturalEventCategory.id }}
        actions={
          <KraphNaturalEventCategory.Actions
            object={data.naturalEventCategory.id}
          />
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphNaturalEventCategory.Komments
                  object={{ id: data.naturalEventCategory.id }}
                />
              ),
            }}
          />
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.naturalEventCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.naturalEventCategory.description}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.naturalEventCategory?.image?.presignedUrl && (
              <img
                src={resolve(data.naturalEventCategory?.image.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>

        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <RoleDefinitionCreator
          naturalEventCategory={data.naturalEventCategory}
        />
      </KraphNaturalEventCategory.ModelPage>
    );
  },
);
