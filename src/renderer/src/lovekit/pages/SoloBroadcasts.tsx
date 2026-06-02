import { Explainer } from "@/components/explainer/Explainer";
import { Button } from "@/components/ui/button";
import { AlpakaCollection, LovekitSoloBroadcast } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import SoloBroadcastList from "../components/lists/SoloBroadcastList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <LovekitSoloBroadcast.ListPage
      title="Images"
      pageActions={
        <>
          <AlpakaCollection.NewButton>
            <Button variant="outline" size="sm">
              <UploadIcon className="h-4 w-4 mr-2" />
              New
            </Button>
          </AlpakaCollection.NewButton>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Collections"
          description="Collections are searchable groups of data. They allow to retrieve data based on semantic queries."
        />
        <SoloBroadcastList pagination={{ limit: 30 }} />
      </div>
    </LovekitSoloBroadcast.ListPage>
  );
};

export default ImagesPage;
