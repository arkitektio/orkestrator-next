import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { LokService } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BackendType,
  useGetServiceInstanceQuery
} from "../api/graphql";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";
import UserCard from "../components/cards/UserCard";
import { UpdateServiceInstanceForm } from "../forms/UpdateServiceInstanceForm";
import { FormSheetAction } from "@/components/ui/form-sheet-action";
import GroupCard from "../components/cards/GroupCard";
export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(useGetServiceInstanceQuery, (props) => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Lok"
      pageActions={
        <>
          <FormSheetAction
            variant={"outline"}
            size={"sm"}
            label="Create"
            description="Update a new Graph"
            buttonChildren={
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Update Service
              </>
            }
          >
            <UpdateServiceInstanceForm instance={props.data.serviceInstance}/>
          </FormSheetAction>
        </>
      }
    >
      {props.data?.serviceInstance?.backend != BackendType.UserDefined && (
        <> This backend is handled internally </>
      )}

      <ListRender array={props.data?.serviceInstance?.allowedUsers} title="Allowed Users">
        {(item, index) => {
          return <UserCard item={item} key={index}/>;
        }}
      </ListRender>

      <ListRender array={props.data?.serviceInstance?.deniedUsers} title="Denied Users">
        {(item, index) => {
          return <UserCard item={item} key={index}/>;
        }}
      </ListRender>

      <ListRender array={props.data?.serviceInstance?.allowedGroups} title="Allowed Groups">
        {(item, index) => {
          return <GroupCard item={item} key={index}/>;
        }}
      </ListRender>

      <ListRender array={props.data?.serviceInstance?.deniedGroups} title="Denied Groups">
        {(item, index) => {
          return <GroupCard item={item} key={index}/>;
        }}
      </ListRender>


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
