import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { MikroProtocolStep } from "@/linkers";
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
                MikroProtocolStep.linkBuilder(item.createProtocolStep.id),
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
