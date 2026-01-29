import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphGraph, KraphMeasurementCategory } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import MeasurementCategoryList from "../components/lists/MeasurementCategoryList";
import CreateGraphForm from "../forms/CreateGraphForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <KraphMeasurementCategory.ListPage
      title="Measurement Categories"
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormDialogAction
              variant={"outline"}
              size={"sm"}
              label="Create"
              description="Create a new Measurement Category"
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
              Your measurement categories
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Measurements represent timed relationsships between your
              measurements and the structures that actually measured the metric.
              <br />
              <strong>
                Explore the various categories to enhance your analysis.
              </strong>
              <br />
            </p>
          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <MeasurementCategoryList pagination={{ limit: 30 }} />
      </div>
    </KraphMeasurementCategory.ListPage>
  );
};

export default Page;
