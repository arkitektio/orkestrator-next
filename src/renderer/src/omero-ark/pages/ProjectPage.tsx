import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { OmeroArkProject } from "@/linkers";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetProjectQuery } from "../api/graphql";
import DatasetCard from "../components/cards/DatasetCard";
import { CreateDatasetForm } from "../forms/CreateDatasetForm";


const Page = asDetailQueryRoute(useGetProjectQuery, ({ data, refetch }) => {

  const navigate = useNavigate();
  return (
    <OmeroArkProject.ModelPage
      object={data?.project.id}
      title={data?.project?.name}
      pageActions={<> <FormDialogAction
        variant={"outline"}
        size={"sm"}
        label="Create"
        description="Create a new Graph"
        buttonChildren={
          <>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create
          </>
        }
        onSubmit={(item) => {
          console.log(item);
          refetch();
        }}
      >
        <CreateDatasetForm project={data?.project} />
      </FormDialogAction></>}>

      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle actions={<></>}>
            {data?.project?.name}
          </DetailPaneTitle>
        </DetailPaneHeader>
        <div className="flex flex-col  p-3 rounded rounded-md mt-2 mb-2">
          <div className="font-light mt-2 ">Created At</div>
          <div className="font-light mt-2 ">Created by</div>

          <div className="font-light mt-2 ">Tags</div>
          <div className="text-xl flex mb-2">
            {data?.project?.tags?.map((tag, index) => (
              <>
                <span className="font-semibold mr-2">#{tag} </span>
              </>
            ))}
          </div>
        </div>
        <ListRender title="Contained Dataset" array={data?.project?.datasets}>
          {(item, index) => <DatasetCard dataset={item} key={index} />}
        </ListRender>
      </DetailPane>
    </OmeroArkProject.ModelPage>
  );
});

export default Page;
