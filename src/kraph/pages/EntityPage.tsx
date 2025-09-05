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
  KraphEntityCategory,
  KraphProtocolEvent,
  KraphProtocolEventCategory,
} from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetEntityQuery } from "../api/graphql";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import CreateNodeQueryForm from "../forms/CreateNodeQueryForm";
import LoadingCreateProtocolEventForm from "../forms/LoadingCreateProtocolEventForm";
import { UpdateEntityForm } from "../forms/UpdateEntityForm";
import { DisplayWidget } from "@/command/Menu";

export default asDetailQueryRoute(useGetEntityQuery, ({ data, refetch }) => {
  const uploadFile = useMediaUpload();

  return (
    <KraphEntity.ModelPage
      object={data.entity.id}
      title={
        <div>
          {data.entity.category.label} - {data?.entity.label}
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{ Comments: <KraphEntity.Komments object={data.entity.id} /> }}
        />
      }
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormSheet
              trigger={
                <Button variant="outline">
                  <HobbyKnifeIcon />
                </Button>
              }
            >
              {data?.entity && <UpdateEntityForm entity={data?.entity} />}
            </FormSheet>

            <KraphEntity.ObjectButton
              object={data.entity.id}
              className="w-full"
            />
          </>
        </div>
      }
    >
      <KraphEntity.Drop
        object={data.entity.id}
        className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6"
      >
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex-row flex">
            <KraphEntityCategory.DetailLink
              object={data.entity.category.id}
              className="text-muted-foreground font-light mr-2"
            >
              {data.entity.category.label}
            </KraphEntityCategory.DetailLink>{" "}
            <div>{data.entity.label}</div>
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            {data.entity.externalId}
          </p>
          <p className="mt-3 text-xl text-muted-foreground">
            <div className="flex flex-row gap-2">
              {data.entity.tags?.map((tag) => (
                <Badge key={tag.id}>{tag.value}</Badge>
              ))}
            </div>
          </p>
          {data.entity.pinned && <>Pinned</>}
        </div>
      </KraphEntity.Drop>


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
    </KraphEntity.ModelPage >
  );
});
