import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { AlpakaCollection, AlpakaLLMModel, AlpakaProvider } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import CollectionList from "../components/lists/CollectionList";
import LLMModelList from "../components/lists/LLMModelList";
import ProviderList from "../components/lists/ProviderList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Providers"
      pageActions={
        <>
          <AlpakaProvider.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </AlpakaProvider.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Providers"
          description="Providers are source for LLM models"
        />
        <ProviderList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
