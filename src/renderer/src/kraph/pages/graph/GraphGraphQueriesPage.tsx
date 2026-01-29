import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import GraphQueryList from "@/kraph/components/lists/GraphQueryList";
import ScatterPlotList from "@/kraph/components/lists/ScatterPlotList";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();


  const id = useParams().id;

  return (
    <PageLayout
      title="Graph Queries"

    >
      <div className="p-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center mb-4">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Graph Queries
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Graphs represent ways to organize your knowledge that you have
              extracted from your data.
            </p>
          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <GraphQueryList pagination={{ limit: 30 }} filters={{ graph: id }} />

        <Card className="my-6 w-full h-0.5 bg-border/50" />
      </div>
    </PageLayout>
  );
};

export default Page;
