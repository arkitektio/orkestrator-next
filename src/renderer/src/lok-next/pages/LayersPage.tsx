import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { DialogButton } from "@/components/ui/dialog-button";
import { LokService } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import LayerList from "../components/lists/LayerList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Layers"
      pageActions={
        <>
          <DialogButton
            name="createserviceinstance"
            variant={"outline"}
            size={"sm"}
            dialogProps={{}}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Layer
          </DialogButton>
        </>
      }
    >
      <Explainer
        title="Layers"
        description="Layers represent connection layers between services and apps. If services are defined within a specific layer, only apps that have access to that layer can access the service."
      />
      <LayerList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
