import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokService } from "@/linkers";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetServiceQuery } from "../api/graphql";
import ServiceInstanceCard from "../components/cards/ServiceInstanceCard";
import { CreateServiceInstanceForm } from "../forms/CreateServiceInstance";

export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(useGetServiceQuery, ({ data }) => {
  const navigate = useNavigate();
  const resolve = useResolve();

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
            <CreateServiceInstanceForm identifier={data.service.identifier} />
          </FormDialogAction>
        </>
      }
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex flex-col">
              {data.service.identifier}
              <div className="text-lg text-gray-500">
                {data.service.description}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-[3/2] items-center justify-center p-6 max-h-[200px]">
                {data.service.logo && (
                  <Image
                    src={resolve(data?.service?.logo.presignedUrl)}
                    className="my-auto"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ListRender array={data?.service?.instances}>
        {(item) => <ServiceInstanceCard item={item} />}
      </ListRender>

      <Separator />
    </PageLayout>
  );
});

export default Page;
