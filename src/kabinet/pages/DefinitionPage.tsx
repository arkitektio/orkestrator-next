import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { KABINET_REFRESH_POD_HASH } from "@/constants";
import { useActionDescription } from "@/lib/rekuest/ActionDescription";
import { KabinetDefinition } from "@/linkers";
import { useImplementationsQuery } from "@/rekuest/api/graphql";
import { useImplementationAction } from "@/rekuest/hooks/useImplementationAction";
import { useCallback } from "react";
import { useGetDefinitionQuery } from "../api/graphql";
import FlavourCard from "../components/cards/FlavourCard";

export const AssignButton = (props: {
  id: string;
  pod: string;
  refetch: () => void;
}) => {
  const { assign } = useImplementationAction({
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
  const { data } = useImplementationsQuery({
    variables: {
      filters: {
        actionHash: KABINET_REFRESH_POD_HASH,
      },
    },
  });

  return (
    <div className="flex flex-row gap-2">
      {data?.implementations.map((t) => (
        <AssignButton id={t.id} pod={props.item} refetch={props.refetch} />
      ))}
    </div>
  );
};

export default asDetailQueryRoute(
  useGetDefinitionQuery,
  ({ data, refetch }) => {
    const description = useActionDescription({
      description: data.definition.description || "",
    });

    const copyHashToClipboard = useCallback(() => {
      navigator.clipboard.writeText(data?.definition?.hash || "");
    }, [data?.definition?.hash]);

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
          <div className="mb-3">
            <h1
              className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-pointer"
              onClick={copyHashToClipboard}
            >
              {data?.definition?.name}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground max-w-[80%]">
              {description}
            </p>
          </div>
        </div>
        <div className="p-6">
          <ListRender array={data?.definition?.flavours} title="Flavours">
            {(item, key) => <FlavourCard item={item} key={key} />}
          </ListRender>
        </div>
      </KabinetDefinition.ModelPage>
    );
  },
);
