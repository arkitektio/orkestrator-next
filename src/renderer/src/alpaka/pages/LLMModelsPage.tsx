import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { AlpakaLLMModel } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import LLMModelList from "../components/lists/LLMModelList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="LLM Models"
      pageActions={
        <>
          <AlpakaLLMModel.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </AlpakaLLMModel.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="LLM Models"
          description="Large language models to chat with."
        />
        <LLMModelList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
