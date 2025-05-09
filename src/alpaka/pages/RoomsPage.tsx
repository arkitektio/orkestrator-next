import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { AlpakaCollection, AlpakaLLMModel, AlpakaProvider, AlpakaRoom } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import CollectionList from "../components/lists/CollectionList";
import LLMModelList from "../components/lists/LLMModelList";
import ProviderList from "../components/lists/ProviderList";
import RoomList from "../components/lists/RoomList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Rooms"
      pageActions={
        <>
          <AlpakaRoom.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </AlpakaRoom.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Rooms"
          description="Rooms are places to chat with LLM models. They are the main interface for interacting with the models."
        />
        <RoomList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default ImagesPage;
