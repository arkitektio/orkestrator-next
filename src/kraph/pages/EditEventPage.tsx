import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import {
  KraphEditEvent,
  KraphNode
} from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import Timestamp from "react-timestamp";
import {
  useGetEditEventQuery
} from "../api/graphql";


export default asDetailQueryRoute(
  useGetEditEventQuery,
  ({ data, refetch }) => {
    const uploadFile = useMediaUpload();

    return (
      <KraphEditEvent.ModelPage
        object={data.editEvent.id}
        title={data?.editEvent.label}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphEditEvent.Komments object={data.editEvent.id} />
              ),
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <>
              <FormSheet trigger={<HobbyKnifeIcon />}>
                Not implemented
              </FormSheet>
            </>
          </div>
        }
      >
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            EditEvent
          </h1>

          <p className="mt-3 text-xl text-muted-foreground"></p>
          <p className="mt-3 text-xl text-muted-foreground">
            <Timestamp date={new Date(data.editEvent.timestamp)} />
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {data.editEvent.edited.map((edit, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <p>
                <strong>Target:</strong>{" "}
                <KraphNode.DetailLink object={edit.target.id}>
                  {edit.target.label}
                </KraphNode.DetailLink>
              </p>
              <p>
                <strong>Change Type:</strong> {edit.changeType}
              </p>
              <p>
                <strong>Previous Value:</strong> {edit.previousValue}
              </p>
              <p>
                <strong>New Value:</strong> {edit.newValue}
              </p>
            </div>
          ))}



        </div>


      </KraphEditEvent.ModelPage>
    );
  },
);
