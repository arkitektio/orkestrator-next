import { Explainer } from "@/components/explainer/Explainer";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { LokRedeemToken } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import RedeemTokenList from "../components/lists/RedeemTokenList";
import { CreateRedeemTokenForm } from "../forms/CreateRedeemTokenForm";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Lok"
      pageActions={
        <>
          <FormDialogAction
            variant={"outline"}
            size={"sm"}
            label="Create"
            description="Create a new Graph"
            buttonChildren={
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Service
              </>
            }
            onSubmit={(item) => {
              console.log(item);
              navigate(LokRedeemToken.linkBuilder(item.createRedeemToken.id));
            }}
          >
            <CreateRedeemTokenForm />
          </FormDialogAction>
        </>
      }
    >
      <Explainer
        title="Redeem Tokens"
        description="Services are the building blocks of every arkitekt server. They define data endpoints, that your apps can interact with. These as the currently available services in your federation."
      />
      <RedeemTokenList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
