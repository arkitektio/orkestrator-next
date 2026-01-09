import { Card } from "@/components/ui/card";
import type { GetKnowledgeViewsQuery } from "../api/graphql";
import { SelectiveNodeViewRenderer } from "./renderers/NodeQueryRenderer";
import { StructureConnectionActions } from "./StructureConnectionActions";

type KnowledgeView = GetKnowledgeViewsQuery["knowledgeViews"][0];

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
        <div className="h-64">
          {view.structure?.bestView ? (
            <SelectiveNodeViewRenderer view={view.structure.bestView} />
          ) : (
            "No view available"
          )}
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
