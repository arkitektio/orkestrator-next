import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  KraphEntity,
  KraphEntityCategory,
  KraphProtocolEvent
} from "@/linkers";
import { SmartLink } from "@/providers/smart/builder";
import {
  ActivityLogIcon,
  PinRightIcon
} from "@radix-ui/react-icons";
import {
  Calendar,
  Database,
  Microscope
} from "lucide-react";
import Timestamp from "react-timestamp";
import { useGetEntityQuery } from "../api/graphql";
import { PropertyEditor } from "../components/PropertyEditor";
import { PropertyRenderer } from "../components/PropertyRenderer";
import CreateNodeQueryForm from "../forms/CreateNodeQueryForm";

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

const Page = asDetailQueryRoute(useGetEntityQuery, ({ data, refetch }) => {
  return (
    <KraphEntity.ModelPage
      variant="black"
      object={data.entity.id}
      title={<>
        <div className="flex flex-row">
          {data.entity.category.label} <div className="ml-2 text-md font-light">{data.entity.label}</div>
        </div>
      </>}
      sidebars={
        <MultiSidebar
          map={{ Comments: <KraphEntity.Komments object={data.entity.id} /> }}
        />
      }
      pageActions={
        <div className="flex flex-row gap-2">
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
        </div>
      }
    >
      <div className="flex flex-col lg:flex-row h-full min-h-[80vh]">
        {/* Left Column: Info */}
        <div className="w-full lg:w-[450px] xl:w-[500px] flex-shrink-0 flex flex-col gap-8 p-4 lg:p-8 lg:overflow-y-auto lg:h-full lg:border-r bg-black z-20">
          {/* Metadata */}


          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex flex-row truncate ellipsis">
            {data.entity.category.label} <div className="ml-2 text-md font-light">{data.entity.label}</div>
          </h1>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" /> Metadata
            </h3>
            <div className="grid gap-4 pl-2">
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Category
                </span>
                <KraphEntityCategory.DetailLink
                  object={data.entity.category.id}
                  className="text-sm font-medium hover:underline"
                >
                  {data.entity.category.label}
                </KraphEntityCategory.DetailLink>
              </div>
              {data.entity.pinned && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PinRightIcon className="h-4 w-4" /> Pinned
                </div>
              )}
            </div>
          </div>

          {(data.entity.category.propertyDefinitions?.length ?? 0) > 0 ? (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Properties</h3>
                <div className="grid gap-2 pl-2">
                  {data.entity.category.propertyDefinitions?.map((def) => {
                    const prop = data.entity.properties.find(
                      (p) => p.key === def.key,
                    );
                    return (
                      <div
                        key={def.key}
                        className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0 group"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-muted-foreground">
                            {def.label || def.key}
                          </span>
                          {def.description && (
                            <span className="text-xs text-muted-foreground/50">
                              {def.description}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <PropertyRenderer
                            value={prop?.value}
                            definition={def}
                          />
                          <PropertyEditor
                            entityId={data.entity.id}
                            definition={def}
                            value={prop?.value}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            data.entity.richProperties.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Properties</h3>
                  <div className="grid gap-2 pl-2">
                    {data.entity.richProperties.map((property) => (
                      <div
                        key={property.key}
                        className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0"
                      >
                        <span className="text-sm font-medium text-muted-foreground">
                          {property.key}
                        </span>
                        <span className="text-sm">{property.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          )}

          {/* Measurements */}
          {data.entity.measuredBy.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Microscope className="h-4 w-4" /> Measurements
                </h3>
                <div className="grid gap-4 pl-2">
                  {data.entity.measuredBy.map((measurement) => (
                    <SmartLink
                      identifier={measurement.source.identifier}
                      object={measurement.source.object || ""}
                      key={`${measurement.id}`}
                    >
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {measurement.category.label}
                          </span>
                          {measurement.source.__typename == "Structure" && (
                            <span className="text-xs text-muted-foreground">
                              Source: {measurement.source.identifier}
                            </span>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </SmartLink>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Protocols (Subjected To & Targeted By) */}
          {(data.entity.participatedIn.length > 0 ||
            data.entity.participatedIn.length > 0) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ActivityLogIcon className="h-4 w-4" /> Protocols & Events
                  </h3>
                  <div className="grid gap-4 pl-2">
                    {data.entity.participatedIn.map((subjected) => (
                      <div
                        key={subjected.id}
                        className="flex items-start gap-4 p-3 border rounded-lg"
                      >
                        <Badge variant="outline">{subjected.role}</Badge>
                        {subjected.target.__typename == "ProtocolEvent" && (
                          <div className="flex-1">
                            <KraphProtocolEvent.DetailLink
                              object={subjected.target.id}
                              className="font-medium hover:underline block"
                            >
                              {subjected.target.category.label}
                            </KraphProtocolEvent.DetailLink>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" />
                              {subjected.target.measuredFrom && (
                                <Timestamp
                                  date={subjected.target.measuredFrom}
                                  relative
                                />
                              )}
                              {subjected.target.measuredFrom && (
                                <span>
                                  (~
                                  {calculateDuration(
                                    subjected.target.measuredFrom,
                                    subjected.target.measuredTo,
                                  )}
                                  )
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {data.entity.resultedOut.map((targeted) => (
                      <div
                        key={targeted.id}
                        className="flex items-start gap-4 p-3 border rounded-lg"
                      >
                        <Badge variant="secondary">{targeted.role}</Badge>
                        {targeted.source.__typename == "ProtocolEvent" && (
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">
                              Targeted by
                            </div>
                            <KraphProtocolEvent.DetailLink
                              object={targeted.source.id}
                              className="font-medium hover:underline block"
                            >
                              {targeted.source.category.label}
                            </KraphProtocolEvent.DetailLink>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" />
                              {targeted.source.measuredFrom && (
                                <Timestamp
                                  date={targeted.source.measuredFrom}
                                  relative
                                />
                              )}
                              {targeted.source.measuredTo && (
                                <Timestamp
                                  date={targeted.source.measuredTo}
                                  relative
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
        </div>

        {/* Right Column: Node View */}
        <div className="flex-1 relative min-h-[500px] lg:min-h-auto">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none hidden lg:block" />
          <div className="absolute inset-0 overflow-hidden">
            Currently not implemented
          </div>
        </div>
      </div>
    </KraphEntity.ModelPage>
  );
});


export default Page;
