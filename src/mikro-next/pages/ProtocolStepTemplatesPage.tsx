import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { MikroProtocolStep, MikroProtocolStepTemplate } from "@/linkers";
import React from "react";
import { useNavigate } from "react-router-dom";
import ProtocolStepList from "../components/lists/ProtocolStepList";
import CreateProtocolStepForm from "../forms/CreateProtocolStepForm";
import CreateProtocolStepTemplateForm from "../forms/CreateProtocolStepTemplateForm";
import ProtocolStepTemplateList from "../components/lists/ProtocolStepTemplateList";
import { PopularTemplatesCarousel } from "../components/carousels/PopularTemplatesCarousel";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Protocol Step Templates"
      pageActions={
        <>
          <FormDialogAction
            label="Create New Template"
            variant={"outline"}
            onSubmit={(item) => {
              console.log(item);
              navigate(
                MikroProtocolStepTemplate.linkBuilder(
                  item.createProtocolStepTemplate.id,
                ),
              );
            }}
          >
            <CreateProtocolStepTemplateForm />
          </FormDialogAction>
        </>
      }
    >
      <PopularTemplatesCarousel />
      <ProtocolStepTemplateList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
