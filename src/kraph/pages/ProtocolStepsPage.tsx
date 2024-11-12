import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { KraphProtocolStep } from "@/linkers";
import React from "react";
import { useNavigate } from "react-router-dom";
import ProtocolStepList from "../components/lists/ProtocolStepList";
import CreateProtocolStepForm from "../forms/CreateProtocolStepForm";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Protocol Steps"
      pageActions={
        <>
          <FormDialogAction
            label="Perform Step"
            variant={"outline"}
            onSubmit={(item) => {
              console.log(item);
              navigate(
                KraphProtocolStep.linkBuilder(item.createProtocolStep.id),
              );
            }}
          >
            <CreateProtocolStepForm />
          </FormDialogAction>
        </>
      }
    >
      <ProtocolStepList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
