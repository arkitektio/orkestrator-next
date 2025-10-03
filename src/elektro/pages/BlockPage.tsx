import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { ElektroAnalogSignal, ElektroBlock } from "@/linkers";
import { useDetailBlockQuery } from "../api/graphql";
import { Card } from "@/components/ui/card";

export type IRepresentationScreenProps = Record<string, never>;

export default asDetailQueryRoute(useDetailBlockQuery, ({ data }) => {
  return (
    <ElektroBlock.ModelPage
      variant="black"
      title={data?.block?.name}
      object={data?.block.id}
      pageActions={
        <div className="flex flex-row gap-2">
          <ElektroBlock.ObjectButton object={data.block.id} />
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <ElektroBlock.Komments object={data.block.id} />,
          }}
        />
      }
    >
      <div className="flex h-full w-full flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h1 className="scroll-m-16 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.block.name}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.block.description}
            </p>
          </div>
        </div>

        {/* Segments Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Segments ({data.block.segments.length})
          </h2>

          <div className="space-y-6">
            {data.block.segments.map((segment, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  {/* Segment Header */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Segment {segment.id}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {segment.analogSignals.length} analog signal
                        {segment.analogSignals.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Signals Grid */}
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {segment.analogSignals.map((signal) => (
                      <div
                        key={signal.id}
                        className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <ElektroAnalogSignal.DetailLink
                              object={signal.id}
                              className="font-medium text-sm hover:underline"
                            >
                              {signal.name || `Signal ${signal.id}`}
                            </ElektroAnalogSignal.DetailLink>
                            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                              ID: {signal.id}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            {signal.unit && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Unit:</span>
                                <span>{signal.unit}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Channels:</span>
                              <span>{signal.channels?.length || 0}</span>
                            </div>
                            {signal.timeTrace && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Time Trace:</span>
                                <span className="text-green-600">
                                  Available
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Channel Summary */}
                          {signal.channels && signal.channels.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Channels:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {signal.channels
                                    .slice(0, 3)
                                    .map((channel) => (
                                      <span
                                        key={channel.id}
                                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-secondary/50"
                                      >
                                        {channel.name || `Ch ${channel.index}`}
                                      </span>
                                    ))}
                                  {signal.channels.length > 3 && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-secondary/30">
                                      +{signal.channels.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ElektroBlock.ModelPage>
  );
});
