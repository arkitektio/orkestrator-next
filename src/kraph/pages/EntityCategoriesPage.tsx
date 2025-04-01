import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphEntityCategory, KraphGraph } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import GraphList from "../components/lists/GraphList";
import CreateGraphForm from "../forms/CreateGraphForm";
import ReagentCategoryList from "../components/lists/ReagentCategoryList";
import CreateEntityCategoryForm from "../forms/CreateEntityCategoryForm";
import EntityCategoryList from "../components/lists/EntityCategoryList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Entity Categories"
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormDialogAction
              variant={"outline"}
              size={"sm"}
              label="Create"
              description="Create a new Entity Category"
              buttonChildren={
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create
                </>
              }
              onSubmit={(item) => {
                console.log(item);
                navigate(KraphEntityCategory.linkBuilder(item.createGraph.id));
              }}
            >
              <CreateEntityCategoryForm />
            </FormDialogAction>
          </>
        </div>
      }
    >
      <div className="p-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center mb-4">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Your Entity categories
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Entities represent the objects of your experiments. They are
              measured in the graph and are the main focus of your analysis.
              They can be anything from genes, proteins, cells, or any other
              biological entity. What ever you can measure, you can represent as
              an entity.
              <br />
            </p>
          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <EntityCategoryList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
