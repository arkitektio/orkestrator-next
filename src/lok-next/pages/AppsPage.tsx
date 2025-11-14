import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { LokApp, LokService } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AppList from "../components/lists/AppList";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <LokApp.ListPage
      title="Applications"
    >
      <Explainer
        title="Applications"
        description="Applications are your workhorses. They are the main way you interact with your data and services. Here you see all applications that are available within your Organisation"
      />
      <AppList />

      <Separator />
    </LokApp.ListPage>
  );
};

export default Page;
