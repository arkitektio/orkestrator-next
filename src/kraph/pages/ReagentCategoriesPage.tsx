import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphGraph } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import GraphList from "../components/lists/GraphList";
import CreateGraphForm from "../forms/CreateGraphForm";
import ReagentCategoryList from "../components/lists/ReagentCategoryList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Reagent Categories"
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
              Your Reagent categories
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Reagents represent experimental additives that are used in your protocols.
              As opposed to entities, they are are reactants and will not be measured in the graph.
              They are rather metadata that will be used to filter the data.
            </p>
          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <ReagentCategoryList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
