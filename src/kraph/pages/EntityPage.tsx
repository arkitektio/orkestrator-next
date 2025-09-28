import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { DisplayWidget } from "@/command/Menu";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import {
  KraphEntity,
  KraphEntityCategory,
  KraphMeasurement,
  KraphProtocolEvent,
} from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import Timestamp from "react-timestamp";
import { useGetEntityQuery } from "../api/graphql";
import { NodeQueriesPlanner } from "../components/NodeQueriesPlanner";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import CreateNodeQueryForm from "../forms/CreateNodeQueryForm";
import LoadingCreateProtocolEventForm from "../forms/LoadingCreateProtocolEventForm";
import { UpdateEntityForm } from "../forms/UpdateEntityForm";

export const calculateDuration = (start?: string, end?: string) => {
  if (!start) return null;
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const durationMs = endDate.getTime() - startDate.getTime();

  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

  let durationStr = "";
  if (days > 0) durationStr += `${days}d `;
  if (hours > 0) durationStr += `${hours}h `;
  if (minutes > 0) durationStr += `${minutes}m `;
  if (seconds > 0 || durationStr === "") durationStr += `${seconds}s`;

  return durationStr.trim();
};

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
            <FormSheet
              trigger={<Button variant="outline">New Query</Button>}
              onSubmit={() => refetch()}
            >
              <CreateNodeQueryForm entity={data.entity} />
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
      <div className="p-2">Measured by</div>

      <div className="flex flex-row gap-2 p-6 w-full">
        {data.entity.measuredBy.map((measurement) => (
          <KraphMeasurement.Smart
            object={measurement.id}
            key={`${measurement.id}`}
            className="w-96"

          >
            <Card className="p-2 flex flex-col flex-1 w-96">
              {measurement.source.__typename == "Structure" && (
                <DisplayWidget
                  identifier={measurement.source.identifier}
                  object={measurement.source.object}
                  link={true}
                />
              )}
              <pre>{measurement.category.label}</pre>
            </Card>
          </KraphMeasurement.Smart>
        ))}
      </div>

      <div className="p-6">Subjectable to</div>

      <div className="flex flex-row gap-2 p-6">
        {data.entity.subjectableTo.map((protocol) => (
          <Card
            key={`${protocol.role}`}
            className="p-2 flex-col gap-2 flex w-96"
          >
            <FormSheet
              trigger={
                <div variant="outline" size="sm">
                  {" "}
                  Subject as <pre>{protocol.role}</pre> in{" "}
                  {protocol.category.label}
                </div>
              }
            >
              <LoadingCreateProtocolEventForm
                rolemap={{ [protocol.role]: data.entity.id }}
                id={protocol.category.id}
              />
            </FormSheet>
          </Card>
        ))}
      </div>

      <div className="p-2">Subjected to</div>

      <div className="flex flex-row gap-2 p-6">
        {data.entity.subjectedTo.map((subjected) => (
          <Card
            key={`${subjected.id}`}
            className="p-2 flex-row gap-2 flex w-96"
          >
            <div className="my-auto border border-1 rounded  px-2 py-1">
              {subjected.role}
            </div>
            {subjected.target.__typename == "ProtocolEvent" && (
              <div className="flex flex-col">
                <KraphProtocolEvent.DetailLink
                  object={subjected.target.id}
                  className={"text-xl font-bold"}
                >
                  {subjected.target.category.label}
                </KraphProtocolEvent.DetailLink>
                <div className="text-sm text-muted-foreground flex flex-row gap-2">
                  {subjected.target.validFrom && (
                    <Timestamp date={subjected.target.validFrom} relative />
                  )}
                  {subjected.target.validTo && subjected.target.validFrom && (
                    <div>
                      (~
                      {calculateDuration(
                        subjected.target.validFrom,
                        subjected.target.validTo,
                      )}
                      )
                    </div>
                  )}
                  {!subjected.target.validTo && !subjected.target.validFrom && (
                    <div>No validity</div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="p-6">Targeted by</div>

      <div className="flex flex-row gap-2 p-6">
        {data.entity.targetedBy.map((targeted) => (
          <Card key={`${targeted.id}`} className="p-2 flex-row gap-2 flex w-96">
            <div className="my-auto border border-1 rounded  px-2 py-1">
              {targeted.role}
            </div>
            {targeted.source.__typename == "ProtocolEvent" && (
              <div className="flex flex-col">
                <KraphProtocolEvent.DetailLink
                  object={targeted.source.id}
                  className={"text-xl font-bold"}
                >
                  {targeted.source.category.label}
                </KraphProtocolEvent.DetailLink>
                <div className="text-sm text-muted-foreground flex flex-row gap-2">
                  {targeted.source.validFrom && (
                    <Timestamp date={targeted.source.validFrom} relative />
                  )}
                  {targeted.source.validTo && targeted.source.validFrom && (
                    <div>
                      (~
                      {calculateDuration(
                        targeted.source.validFrom,
                        targeted.source.validTo,
                      )}
                      )
                    </div>
                  )}
                  {!targeted.source.validTo && !targeted.source.validFrom && (
                    <div>No validity</div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <NodeQueriesPlanner entity={data.entity} />

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
