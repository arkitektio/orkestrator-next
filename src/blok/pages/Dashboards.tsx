import { Guard } from "@/arkitekt/Arkitekt";
import registry, { Registry } from "../registry";
import { ModuleWrapper } from "../Wrapper";
import { useRef, useState } from "react";
import {
  DockviewApi,
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from "dockview";
import { PanelKind, useAgentsQuery } from "@/rekuest/api/graphql";
import { Button } from "@/components/ui/button";
import { MetaApplication } from "@/hooks/use-metaapp";
import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { PageLayout } from "@/components/layout/PageLayout";

export const Dashboards = () => {
  const [selectedDashboard, setSelectedDashboard] = useState<string>("default");
  const [dashboards, setDashboards] = useState<string[]>(() => {
    const saved = localStorage.getItem("dashboards");
    return saved ? JSON.parse(saved) : ["default"];
  });

  const createNewDashboard = () => {
    const newId = `dashboard-${Date.now()}`;
    setDashboards((prev) => [...prev, newId]);
    setSelectedDashboard(newId);
    localStorage.setItem("dashboards", JSON.stringify([...dashboards, newId]));
  };

  const loadDashboard = (id: string) => {
    const layout = localStorage.getItem(`dockview-layout-${id}`);
    if (layout) {
      // Handle loading layout
      setSelectedDashboard(id);
    }
  };

  return (
    <PageLayout title="Dashboards">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <select
            value={selectedDashboard}
            onChange={(e) => loadDashboard(e.target.value)}
            className="border p-2 rounded"
          >
            {dashboards.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <Button onClick={createNewDashboard}>New Dashboard</Button>
        </div>
      </div>
    </PageLayout>
  );
};