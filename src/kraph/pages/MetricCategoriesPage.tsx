import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphGraph, KraphMetricCategory } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import MetricCategoryList from "../components/lists/MetricCategoryList";
import CreateGraphForm from "../forms/CreateGraphForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <KraphMetricCategory.ListPage
      title="Metric Categories"
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormDialogAction
              variant={"outline"}
              size={"sm"}
              label="Create"
              description="Create a new Reagent Category"
              buttonChildren={
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create
                </>
              }
              onSubmit={(item) => {
                console.log(item);
                navigate(KraphGraph.linkBuilder(item.createGraph.id));
              }}
            >
              <CreateGraphForm />
            </FormDialogAction>
          </>
        </div>
      }
    >
      <div className="p-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center mb-4">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Your metric categories
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Metrics represent the measurements that are taken in your
              experiments, and they are always attached to your structures (e.g.
              to your ROI), that actually measured the metric.
            </p>
          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <MetricCategoryList pagination={{ limit: 30 }} />
      </div>
    </KraphMetricCategory.ListPage>
  );
};

export default Page;
