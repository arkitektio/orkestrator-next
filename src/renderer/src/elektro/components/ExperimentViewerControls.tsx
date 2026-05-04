import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import {
  useExperimentViewerStore,
  useExperimentViewerStoreApi,
} from "./store/experimentViewerStore";

export const ExperimentViewerControls: React.FC = () => {
  const store = useExperimentViewerStoreApi();

  const canUndo = useExperimentViewerStore(
    (s) => s.rangeHistory.length > 0,
  );
  const canRedo = useExperimentViewerStore(
    (s) => s.rangeFuture.length > 0,
  );
  const stepSize = useExperimentViewerStore((s) => s.stepSize);

  return (
    <div className="absolute top-0 right-0 mr-2 mt-2 flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          store.getState().undo();
        }}
        disabled={!canUndo}
      >
        <ArrowLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          store.getState().redo();
        }}
        disabled={!canRedo}
      >
        <ArrowRight />
      </Button>
      <Button
        onClick={() => store.getState().reset()}
        variant="outline"
      >
        <ReloadIcon />
      </Button>
      <Button
        variant="outline"
        onClick={() => store.getState().setForcedStepSize(1)}
      >
        Raw {stepSize}
      </Button>
    </div>
  );
};
