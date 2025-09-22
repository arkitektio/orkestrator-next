import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface StructureConnectionActionsProps {
  onConnect: () => void;
  onConnectWithMeasurement: () => void;
}

export const StructureConnectionActions = ({
  onConnect,
  onConnectWithMeasurement,
}: StructureConnectionActionsProps) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <p className="text-sm text-scroll font-light">
        Not connected yet to Graph
      </p>
      <div className="flex gap-2">
        <Button
          onClick={onConnect}
          variant={"outline"}
          size="sm"
          className="flex-1"
        >
          Connect
        </Button>
        <Button
          onClick={onConnectWithMeasurement}
          variant={"default"}
          size="sm"
          className="flex-1"
        >
          <Plus className="h-3 w-3 mr-1" />
          Connect & Measure
        </Button>
      </div>
    </div>
  );
};
