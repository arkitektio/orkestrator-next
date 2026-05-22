import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroStage } from "@/linkers";
import { useGetStageQuery } from "@/mikro-next/api/graphql";

export const StageDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetStageQuery({
    variables: {
      id: props.object,
    },
  });

  if (!data?.stage) {
    return <div className="text-xs text-muted-foreground">Stage not found</div>;
  }

  const stage = data.stage;
  const viewCount = stage.affineViews?.length ?? 0;

  if (props.context === "command") {
    return (
      <MikroStage.DetailLink object={stage}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm truncate">{stage.name}</span>
          {viewCount > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {viewCount} {viewCount === 1 ? "position" : "positions"}
            </span>
          )}
        </div>
      </MikroStage.DetailLink>
    );
  }

  return (
    <MikroStage.DetailLink object={stage}>
      <div className="w-full rounded-lg border border-border/60 bg-card p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold text-sm truncate">{stage.name}</div>
          {viewCount > 0 && (
            <span className="text-xs text-muted-foreground shrink-0">
              {viewCount} {viewCount === 1 ? "position" : "positions"}
            </span>
          )}
        </div>

        {stage.affineViews && stage.affineViews.length > 0 && (
          <div className="space-y-1">
            {stage.affineViews.slice(0, 5).map((view) => (
              <div
                key={view.id}
                className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1"
              >
                <span className="truncate font-medium">{view.image.name}</span>
                {view.image.store?.shape && (
                  <span className="text-muted-foreground font-mono shrink-0 ml-2">
                    {view.image.store.shape.slice(-2).join("×")}
                  </span>
                )}
              </div>
            ))}
            {stage.affineViews.length > 5 && (
              <div className="text-xs text-muted-foreground text-center pt-1">
                +{stage.affineViews.length - 5} more
              </div>
            )}
          </div>
        )}
      </div>
    </MikroStage.DetailLink>
  );
};
