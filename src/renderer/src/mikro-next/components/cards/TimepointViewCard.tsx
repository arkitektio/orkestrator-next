import { CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplay } from "@/lib/quantities";

import { TimepointViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: TimepointViewFragment;
}

// No MikroTimepointView linker exists (would need a backend @mikro/timepointview
// identifier), so this card renders plain via ViewCard rather than a .Smart wrapper.
const TheCard = ({ view }: Props) => {
  return (
    <ViewCard view={view}>
      <CardHeader>
        <CardTitle>{view.era.name}</CardTitle>
        <div className="mt-1 flex flex-row gap-3 text-xs text-muted-foreground">
          <div>
            <span className="text-muted">Since start</span>{" "}
            {formatDisplay(view.timeSinceStart, "time")}
          </div>
          {view.indexSinceStart != null && (
            <div>
              <span className="text-muted">Frame</span> {view.indexSinceStart}
            </div>
          )}
        </div>
      </CardHeader>
    </ViewCard>
  );
};

export default TheCard;
