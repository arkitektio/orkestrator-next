import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphGraph, KraphRelationCategory } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import RelationCategoryList from "../components/lists/RelationCategoryList";
import CreateRelationCategoryForm from "../forms/CreateRelationCategoryForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <KraphRelationCategory.ListPage
      title="Relation Categories"
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
              <CreateRelationCategoryForm />
            </FormDialogAction>
          </>
        </div>
      }
    >
      <div className="p-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center mb-4">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Your relations categories
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Relations represent the connections between your entities. They
              are the links that bind your entities together and allow you to
              understand the relationships between them. They can be anything
              from physical interactions, to functional relationships, to
              regulatory connections. You can just relate anything
            </p>
          </div>
          <Card className="w-full h-full flex-row relative"></Card>
        </div>

        <RelationCategoryList pagination={{ limit: 30 }} />
      </div>
    </KraphRelationCategory.ListPage>
  );
};

export default Page;
