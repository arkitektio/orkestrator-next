import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  KraphProtocolEventCategory,
  KraphProtocolStepTemplate,
} from "@/linkers";
import {
  useGetProtocolEventCategoryQuery,
  useUpdateProtocolEventCategoryMutation,
} from "../api/graphql";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";
import CreateGraphQueryForm from "../forms/CreateGraphQueryForm";
import LoadingCreateProtocolEventForm from "../forms/LoadingCreateProtocolEventForm";

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
      <KraphProtocolEventCategory.ModelPage
        title={data?.protocolEventCategory?.label}
        object={data.protocolEventCategory.id}
        actions={
          <KraphProtocolEventCategory.Actions
            object={data.protocolEventCategory.id}
          />
        }
        pageActions={
          <FormSheet
            trigger={
              <Button variant="outline" size="sm">
                {" "}
                Perform {data.protocolEventCategory.label}
              </Button>
            }
            onSubmit={() => refetch()}
          >
            <LoadingCreateProtocolEventForm
              rolemap={{}}
              id={data.protocolEventCategory.id}
            />
          </FormSheet>
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

        <div className="flex flex-col">
          {data.protocolEventCategory.sourceEntityRoles.map((role) => (
            <div key={role.role}> Source Role: {role.role}</div>
          ))}
        </div>
        <div className="flex flex-col">
          {data.protocolEventCategory.targetEntityRoles.map((role) => (
            <div key={role.role}> Target Role: {role.role}</div>
          ))}
        </div>

        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <div className="flex flex-col p-6 h-full">
          {data.protocolEventCategory.bestQuery ? (
            <SelectiveGraphQueryRenderer
              graphQuery={data.protocolEventCategory.bestQuery}
            />
          ) : (
            <div className="h-ful w-ull flex flex-col items-center justify-center">
              <p className="text-sm font-light mb-3">
                No Graph Query yet for this category
              </p>
              <FormDialog
                trigger={<Button variant="outline">Create Query</Button>}
                onSubmit={() => refetch()}
              >
                <CreateGraphQueryForm category={data.protocolEventCategory} />
              </FormDialog>
            </div>
          )}
        </div>
      </KraphProtocolEventCategory.ModelPage>
    );
  },
);
