import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import {
  BackendType,
  useCreateRoomMutation,
  useGetServiceInstanceQuery,
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
import { Card } from "@/components/ui/card";
export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(useGetServiceInstanceQuery, (props) => {
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
            <CreateServiceInstanceForm />
          </FormDialogAction>
        </>
      }
    >
      {props.data?.serviceInstance?.backend != BackendType.UserDefined && (
        <> This backend is handled internally </>
      )}

      <ListRender array={props.data?.serviceInstance?.userDefinitions}>
        {(item) => {
          return (
            <Card className="p-3">
              {item.values.map((x) => (
                <div>{x.key}</div>
              ))}
            </Card>
          );
        }}
      </ListRender>

      <Separator />
    </PageLayout>
  );
});

export default Page;
