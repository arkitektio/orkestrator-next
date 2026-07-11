import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { StringField } from "@/components/fields/StringField";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { DragZone } from "@/components/upload/drag";
import { useKraphMediaUpload } from "@/datalayer/hooks/useKraphMediaUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  KraphProtocolEventCategory,
  KraphProtocolStepTemplate
} from "@/linkers";
import { useFieldArray, useForm } from "react-hook-form";
import {
  ProtocolEventCategoryFragment,
  UpdateProtocolEventDefinitionInput,
  useGetProtocolEventCategoryQuery,
  useSearchTagsLazyQuery,
  useUpdateProtocolEventCategoryMutation
} from "../api/graphql";
import { buildUpdateProtocolEventDefinitionInput } from "../protocolEventInput";

export type IRepresentationScreenProps = {};

// Note: the backend no longer stores rich-text `plateChildren` on event
// categories, and the previous source/target "role" concept (with reagent
// roles, variable definitions and tag/category filters) has been unified
// into `inputs` / `outputs: EventRole[]` (each with a `descriptor` supporting
// only `tags`/`keys`/`ontotologyTerms`/`defaultCategoryKey`). The rich text
// editor and reagent/variable role editors have therefore been dropped here
// in favor of a plain role editor bound to the current schema, mirroring
// `NaturalEventCategoryPage.tsx`.
export const RoleDefinitionCreator = ({
  protocolEventCategory,
}: {
  protocolEventCategory: ProtocolEventCategoryFragment;
}) => {
  const [update] = useUpdateProtocolEventCategoryMutation();

  const onUpdate = (data: UpdateProtocolEventDefinitionInput) => {
    update({
      variables: {
        input: data,
      },
    });
  };

  const myform = useForm<UpdateProtocolEventDefinitionInput>({
    defaultValues: buildUpdateProtocolEventDefinitionInput(
      protocolEventCategory,
      {
        label: protocolEventCategory.label,
        description: protocolEventCategory.description,
        inputs: protocolEventCategory.inputs.map((role) => ({
          key: role.key,
          role: role.role,
          descriptor: {
            tags: role.descriptor.tags,
            keys: role.descriptor.keys,
            ontotologyTerms: role.descriptor.ontotologyTerms,
            defaultCategoryKey: role.descriptor.defaultCategoryKey,
          },
        })),
        outputs: protocolEventCategory.outputs.map((role) => ({
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
    ),
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
  useGetProtocolEventCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphMediaUpload();
    const [update] = useUpdateProtocolEventCategoryMutation();

    const resolve = useResolve();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await update({
          variables: {
            input: buildUpdateProtocolEventDefinitionInput(
              data.protocolEventCategory,
              { image: response },
            ),
          },
        });
        await refetch();
      }
    };

    return (
      <KraphProtocolEventCategory.ModelPage
        title={data?.protocolEventCategory?.label}
        object={{ id: data.protocolEventCategory.id }}
        actions={
          <KraphProtocolEventCategory.Actions
            object={data.protocolEventCategory.id}
          />
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphProtocolStepTemplate.Komments
                  object={{ id: data.protocolEventCategory.id }}
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
            {data.protocolEventCategory?.image?.presignedUrl && (
              <img
                src={resolve(data.protocolEventCategory?.image.presignedUrl)}
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
      </KraphProtocolEventCategory.ModelPage>
    );
  },
);
