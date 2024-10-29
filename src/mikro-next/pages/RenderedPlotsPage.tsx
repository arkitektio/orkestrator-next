import { Explainer } from "@/components/explainer/Explainer";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { DroppableNavLink } from "@/components/ui/link";
import { usePrimaryReturnNodesQuery } from "@/rekuest/api/graphql";
import { SparkleIcon, UploadIcon } from "lucide-react";
import React from "react";
import RenderedPlotList from "../components/lists/RenderedPlotList";

export type IRepresentationScreenProps = {};

export const PlotterSidebar = (props: {}) => {
  const { data } = usePrimaryReturnNodesQuery({
    variables: {
      pagination: {
        limit: 5,
      },
      identifier: "@mikro/renderedplot",
    },
  });

  return (
    <>
      <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
        {data?.nodes.map((node, i) => (
          <DroppableNavLink
            to={`/mikro/plotters/${node.id}`}
            key={i}
            className="flex flex-row w-full gap-3 rounded-lg text-muted-foreground transition-all hover:text-primary"
          >
            <SparkleIcon className="h-4 w-4" />
            {node.name}
          </DroppableNavLink>
        ))}
      </div>
    </>
  );
};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Plots"
      pageActions={
        <>
          <Button variant="outline" size="sm">
            <UploadIcon className="h-4 w-4 mr-2" />
            Open in Plotly
          </Button>
        </>
      }
      sidebars={
        <MultiSidebar
          map={{
            Plotters: <PlotterSidebar />,
          }}
        />
      }
    >
      <div className="p-3">
        <Explainer
          title="Plots"
          description="Plots are visual representations of your data. They allow you to see your data in a visual way. Arkitekt plots can add annotations to your plots, which can help you understand your data even better."
        />
        <RenderedPlotList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
