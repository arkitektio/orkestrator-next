import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphEntityCategory, KraphProtocolEventCategory } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import StructureCategoryList from "../components/lists/StructureCategoryList";
import CreateEntityCategoryForm from "../forms/CreateEntityCategoryForm";
import ProtocolEventCategoryList from "../components/lists/ProtocolEventCategoryList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Protocol Event Categories"
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormDialogAction
              variant={"outline"}
              size={"sm"}
              label="Create"
              description="Create a new Protocol Category"
              buttonChildren={
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create
                </>
              }
              onSubmit={(item) => {
                console.log(item);
                navigate(KraphProtocolEventCategory.linkBuilder(item.createGraph.id));
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
              Your Protocol categories
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Protocl events represent the events that happen during your experiments. They are
              the best metadata to filter the data. They can be anything from
              experimental conditions, treatments, or any other event that happens
              during your experiment. Whatever you do to your samples, you should represent
              it as a protocol event.
              </p>

          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <ProtocolEventCategoryList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
