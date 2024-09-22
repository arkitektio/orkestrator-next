import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { withKabinet } from "@/arkitekt";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KABINET_REFRESH_POD_HASH } from "@/constants";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { KabinetDefinition } from "@/linkers";
import { useTemplatesQuery } from "@/rekuest/api/graphql";
import { useTemplateAction } from "@/rekuest/hooks/useTemplateAction";
import { useGetDefinitionQuery } from "../api/graphql";

export const AssignButton = (props: {
  id: string;
  pod: string;
  refetch: () => void;
}) => {
  const { assign } = useTemplateAction({
    id: props.id,
  });

  const doassign = async () => {
    console.log(
      await assign({
        args: {
          pod: props.pod,
        },
      }),
      props.refetch(),
    );
  };

  return (
    <Button onClick={doassign} variant={"outline"} size="sm">
      Refresh
    </Button>
  );
};

const RefreshLogsButton = (props: { item: string; refetch: () => void }) => {
  const { data } = useTemplatesQuery({
    variables: {
      filters: {
        nodeHash: KABINET_REFRESH_POD_HASH,
      },
    },
  });

  return (
    <div className="flex flex-row gap-2">
      {data?.templates.map((t) => (
        <AssignButton id={t.id} pod={props.item} refetch={props.refetch} />
      ))}
    </div>
  );
};

export default asDetailQueryRoute(
  withKabinet(useGetDefinitionQuery),
  ({ data, refetch }) => {
    return (
      <KabinetDefinition.ModelPage
        title={data?.definition?.name}
        object={data?.definition?.id}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KabinetDefinition.Komments object={data?.definition?.id} />
              ),
            }}
          />
        }
        pageActions={<></>}
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data?.definition.name}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data?.definition.description && (
                <NodeDescription description={data.definition.description} />
              )}
            </p>
          </div>
        </div>
      </KabinetDefinition.ModelPage>
    );
  },
);
