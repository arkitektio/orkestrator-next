import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { ListRender } from "@/components/layout/ListRender";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import {
  KraphEntity,
  KraphProtocolEvent,
  KraphProtocolEventCategory,
  KraphReagent,
} from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetEntityQuery, useGetProtocolEventQuery } from "../api/graphql";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import CreateNodeQueryForm from "../forms/CreateNodeQueryForm";
import LoadingCreateProtocolEventForm from "../forms/LoadingCreateProtocolEventForm";
import { MultiSidebar } from "@/components/layout/MultiSidebar";

export default asDetailQueryRoute(
  useGetProtocolEventQuery,
  ({ data, refetch }) => {
    const uploadFile = useMediaUpload();

    return (
      <KraphProtocolEvent.ModelPage
        object={data.protocolEvent.id}
        title={data?.protocolEvent.label}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphProtocolEvent.Komments object={data.protocolEvent.id} />
              ),
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <>
              <FormSheet trigger={<HobbyKnifeIcon />}>
                Not implemented
              </FormSheet>
            </>
          </div>
        }
      >
        <KraphEntity.Drop
          object={data.protocolEvent.id}
          className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6"
        >
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.protocolEvent.category.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground"></p>
            <p className="mt-3 text-xl text-muted-foreground">
              <Badge>{data.protocolEvent.id}</Badge>
            </p>
          </div>
        </KraphEntity.Drop>

        <div className="flex flex-col p-6 h-full">
          {data.protocolEvent.bestView ? (
            <SelectiveNodeViewRenderer view={data.protocolEvent.bestView} />
          ) : (
            <div className="h-ful w-ull flex flex-col items-center justify-center">
              <p className="text-sm font-light mb-3">
                No Node Query yet for this category
              </p>
              <FormDialog
                trigger={<Button variant="outline">Create Query</Button>}
                onSubmit={() => refetch()}
              >
                <CreateNodeQueryForm entity={data.protocolEvent} />
              </FormDialog>
            </div>
          )}
        </div>
      </KraphProtocolEvent.ModelPage>
    );
  },
);
