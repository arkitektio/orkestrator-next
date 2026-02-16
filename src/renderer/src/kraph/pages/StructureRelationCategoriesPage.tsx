import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphGraph, KraphStructureRelationCategory } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import StructureRelationCategoryList from "../components/lists/StructureRelationCategoryList";
import CreateStructureRelationCategoryForm from "../forms/CreateStructureRelationCategoryForm";


const Page = () => {
  const navigate = useNavigate();

  return (
    <KraphStructureRelationCategory.ListPage
      title="Structure Relations"
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormDialogAction
              variant={"outline"}
              size={"sm"}
              label="Create"
              description="Create a new Structure Relation Category"
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
              <CreateStructureRelationCategoryForm />
            </FormDialogAction>
          </>
        </div>
      }
    >
      <div className="p-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center mb-4">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Your structure relations categories
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Relations represent the connections between your data. They are
              the links that bind your entities together and allow you to
              understand the relationships between them. Other than entity
              relations they are designed to model relations between your data.
            </p>
          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <StructureRelationCategoryList pagination={{ limit: 30 }} />
      </div>
    </KraphStructureRelationCategory.ListPage>
  );
};

export default Page;
