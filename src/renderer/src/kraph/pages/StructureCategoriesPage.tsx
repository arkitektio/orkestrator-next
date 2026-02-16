import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphEntityCategory, KraphStructureCategory } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import StructureCategoryList from "../components/lists/StructureCategoryList";
import CreateEntityCategoryForm from "../forms/CreateEntityCategoryForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <KraphStructureCategory.ListPage
      title="Structure Categories"
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormDialogAction
              variant={"outline"}
              size={"sm"}
              label="Create"
              description="Create a new Structure Category"
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
              Your Structure categories
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Oh Structures! Structures represent the data that carries measurments and links to the underlining
              biological entity. They are the main focus of your analysis and carry metrics.
            </p>

          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <StructureCategoryList pagination={{ limit: 30 }} />
      </div>
    </KraphStructureCategory.ListPage>
  );
};

export default Page;
