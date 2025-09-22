import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ProjectList from "../components/lists/ProjectList";



const Page = () => {

  return (
    <PageLayout
      title="Projects"
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
          title="Projects"
          description="Projects allow you to group your images and files together. Just like folders. "
        />
        <ProjectList pagination={{ limit: 30 }} filters={{ parentless: true }} />
      </div>
    </PageLayout>
  );
};

export default Page;
