import { useState } from "react";

export const useMeasurementDialog = () => {
  const [selectedGraph, setSelectedGraph] = useState<string | null>(null);
  const [showMeasurementDialog, setShowMeasurementDialog] = useState(false);

  const handleConnectWithMeasurement = (graphId: string) => {
    setSelectedGraph(graphId);
    setShowMeasurementDialog(true);
  };

  const closeMeasurementDialog = () => {
    setShowMeasurementDialog(false);
    setSelectedGraph(null);
  };

  return {
    selectedGraph,
    showMeasurementDialog,
    handleConnectWithMeasurement,
    closeMeasurementDialog,
    setShowMeasurementDialog,
  };
};
