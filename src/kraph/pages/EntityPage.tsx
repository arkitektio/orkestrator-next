import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import {
  KraphEntity,
  KraphProtocolEventCategory
} from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetEntityQuery } from "../api/graphql";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import CreateNodeQueryForm from "../forms/CreateNodeQueryForm";
import LoadingCreateProtocolEventForm from "../forms/LoadingCreateProtocolEventForm";

export default asDetailQueryRoute(useGetEntityQuery, ({ data, refetch }) => {
  const uploadFile = useMediaUpload();

  return (
    <KraphEntity.ModelPage
      object={data.entity.id}
      title={data?.entity.label}
      sidebars={
        <MultiSidebar
          map={{ Comments: <KraphEntity.Komments object={data.entity.id} /> }}
        />
      }
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormSheet trigger={<HobbyKnifeIcon />}>Not implemented</FormSheet>
          </>
        </div>
      }
    >
      <KraphEntity.Drop
        object={data.entity.id}
        className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6"
      >
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.entity.category.label}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground"></p>
          <p className="mt-3 text-xl text-muted-foreground">
            <Badge>{data.entity.id}</Badge>
          </p>
        </div>
      </KraphEntity.Drop>

      <div className="flex flex-col p-6">
        <ListRender array={data.entity.subjectableTo}>
          {(playable) => (
            <Card
              key={`${playable.role}-${playable.category.id}`}
              className="p-2 m-2 flex-row gap-2 flex"
            >
              <KraphProtocolEventCategory.DetailLink
                object={playable.category.id}
              >
                Subject as {playable.role} in {playable.category.label}
              </KraphProtocolEventCategory.DetailLink>

              <FormSheet
                trigger={<Button variant="outline"> {">>"}</Button>}
                onSubmit={() => refetch()}
              >
                <LoadingCreateProtocolEventForm
                  id={playable.category.id}
                  rolemap={{ [playable.role]: data.entity.id }}
                />
              </FormSheet>
            </Card>
          )}
        </ListRender>
      </div>
      <div className="flex flex-col p-6">
        <ListRender array={data.entity.targetableBy}>
          {(playable) => (
            <Card
              key={`${playable.role}-${playable.category.id}`}
              className="p-2 m-2 flex-row gap-2 flex"
            >
              <KraphProtocolEventCategory.DetailLink
                object={playable.category.id}
              >
                Target as {playable.role} in {playable.category.label}
              </KraphProtocolEventCategory.DetailLink>

              <FormSheet
                trigger={<Button variant="outline"> {"<<"} </Button>}
                onSubmit={() => refetch()}
              >
                <LoadingCreateProtocolEventForm
                  id={playable.category.id}
                  rolemap={{ [playable.role]: data.entity.id }}
                />
              </FormSheet>
            </Card>
          )}
        </ListRender>
      </div>
      <div className="flex flex-col p-6 h-full">
        {data.entity.bestView ? (
          <SelectiveNodeViewRenderer view={data.entity.bestView} />
        ) : (
          <div className="h-ful w-ull flex flex-col items-center justify-center">
            <p className="text-sm font-light mb-3">
              No Node Query yet for this category
            </p>
            <FormDialog
              trigger={<Button variant="outline">Create Query</Button>}
              onSubmit={() => refetch()}
            >
              <CreateNodeQueryForm entity={data.entity} />
            </FormDialog>
          </div>
        )}
      </div>
    </KraphEntity.ModelPage>
  );
});
