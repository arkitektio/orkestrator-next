import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroFile } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetFileQuery, usePinStageMutation } from "../api/graphql";
import { UpdateFileForm } from "../forms/UpdateFileForm";

export default asDetailQueryRoute(useGetFileQuery, ({ data, refetch }) => {
  const [pinStage] = usePinStageMutation();

  return (
    <MikroFile.ModelPage
      actions={<MikroFile.Actions object={data.file.id} />}
      object={data.file.id}
      title={data.file.name}
      sidebars={
        <MultiSidebar
          map={{ Comments: <MikroFile.Komments object={data.file.id} /> }}
        />
      }
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <>
                <FormSheet trigger={<HobbyKnifeIcon />}>
                  {data?.file && <UpdateFileForm file={data?.file} />}
                </FormSheet>
              </>
            }
          >
            {data?.file?.name}
          </DetailPaneTitle>
        </DetailPaneHeader>
        <ListRender array={data?.file?.origins}>
          {(image, index) => <>{image.id}</>}
        </ListRender>
      </DetailPane>
    </MikroFile.ModelPage>
  );
});
