import { Card } from "@/components/ui/card";
import { StructureConnectionActions } from "./StructureConnectionActions";

// NOTE: `GetKnowledgeViewsQuery`/`knowledgeViews` and the "best view" node
// query renderer it used to delegate to no longer exist on the current
// backend schema (there is no `.graphql` operation left that produces this
// shape). This component has no callers anywhere in the app right now; it's
// kept compiling against a local, structurally-equivalent type with the
// removed view-rendering branch dropped, until a replacement query/renderer
// is designed against the current schema.
export type KnowledgeView = {
  structureCategory: { id: string; graph: { id: string; name: string } };
  structure?: { id: string; label: string } | null;
};

interface KnowledgeViewCardProps {
  view: KnowledgeView;
  onConnect: (graphId: string) => void;
  onConnectWithMeasurement: (graphId: string) => void;
}

export const KnowledgeViewCard = ({
  view,
  onConnect,
  onConnectWithMeasurement,
}: KnowledgeViewCardProps) => {
  const handleConnect = () => {
    onConnect(view.structureCategory.graph.id);
  };

  const handleConnectWithMeasurement = () => {
    onConnectWithMeasurement(view.structureCategory.graph.id);
  };

  return (
    <Card className="p-3">
      <h3 className="text-scroll font-semibold text-xs">
        {view.structureCategory.graph.name}
      </h3>
      {view.structure ? (
        <div className="h-64 text-xs text-muted-foreground">
          {view.structure.label}
        </div>
      ) : (
        <StructureConnectionActions
          onConnect={handleConnect}
          onConnectWithMeasurement={handleConnectWithMeasurement}
        />
      )}
    </Card>
  );
};
