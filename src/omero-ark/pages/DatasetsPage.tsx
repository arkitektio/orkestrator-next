import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import DatasetList from "../components/lists/DatasetList";



const Page = () => {

  return (
    <PageLayout
      title="Datasets"
      pageActions={
        <>
          <Button variant="outline" size="sm" >
            <PlusIcon className="h-4 w-4 mr-2" />
            New
          </Button>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Datasets"
          description="Datasets allow you to group your images and files together. Just like folders. "
        />
        <DatasetList pagination={{ limit: 30 }} filters={{ parentless: true }} />
      </div>
    </PageLayout>
  );
};

export default Page;
