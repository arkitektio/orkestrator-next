import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { MikroProtocolStep } from "@/linkers";
import React from "react";
import { useNavigate } from "react-router-dom";
import ProtocolStepList from "../components/lists/ProtocolStepList";
import CreateProtocolStepForm from "../forms/CreateProtocolStepForm";
import CreateProtocolStepTemplateForm from "../forms/CreateProtocolStepTemplateForm";
import ProtocolStepTemplateList from "../components/lists/ProtocolStepTemplateList";

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
                MikroProtocolStep.linkBuilder(item.createProtocolStep.id),
              );
            }}
          >
            <CreateProtocolStepTemplateForm />
          </FormDialogAction>
        </>
      }
    >
      <ProtocolStepTemplateList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
