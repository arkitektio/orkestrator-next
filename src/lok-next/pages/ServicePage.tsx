import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import {
  useCreateRoomMutation,
  useGetServiceQuery,
  useMeQuery,
} from "../api/graphql";
import { ThreadsCarousel } from "../components/carousels/ThreadsCarousel";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { PlusIcon } from "lucide-react";
import { LokService } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";
import ServiceList from "../components/lists/ServiceList";
import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import ServiceInstanceCard from "../components/cards/ServiceInstanceCard";
export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(useGetServiceQuery, (props) => {
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
              navigate(LokService.linkBuilder(item.linkedExpression.id));
            }}
          >
            <CreateServiceInstanceForm
              identifier={props.data.service.identifier}
            />
          </FormDialogAction>
        </>
      }
    >
      <ListRender array={props.data?.service?.instances}>
        {(item) => <ServiceInstanceCard item={item} />}
      </ListRender>

      <Separator />
    </PageLayout>
  );
});

export default Page;
