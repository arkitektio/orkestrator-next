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
                New Token
              </>
            }
            onSubmit={(data) => {
              console.log(data);
              navigate(LokRedeemToken.linkBuilder(data.createRedeemToken.id));
            }}
          >
            <CreateRedeemTokenForm />
          </FormDialogAction>
        </>
      }
    >
      <Explainer
        title="Redeem Tokens"
        description="Redeem Tokens allow users to authorize new apps or devices to access your arkitekt account. Each token can be used to securely link a new application or device, ensuring that only trusted entities gain access. Manage your tokens carefully to maintain the security of your account."
      />
      <RedeemTokenList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
