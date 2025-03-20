import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { DragZone } from "@/components/upload/drag";
import { useLokUpload } from "@/datalayer/hooks/useLokUpload";
import { LokUser } from "@/linkers";
import { useUpdateUserProfileMutation, useUserQuery } from "../api/graphql";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";

export type IRepresentationScreenProps = {};

const Page = asDetailQueryRoute(useUserQuery, ({ data }) => {
  const uploadFile = useLokUpload();

  const resolve = useResolve();
  const [update] = useUpdateUserProfileMutation();

  const createFile = async (file: File, key: string) => {
    update({
      variables: {
        input: {
          id: data.user.profile.id,
          avatar: key,
          name: data.user.username,
        },
      },
    });
  };

  return (
    <LokUser.ModelPage
      object={data.user.id}
      actions={<LokUser.Actions object={data.user.id} />}
      title={data?.user?.username}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.user.username}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-1">
            <div>
              <div className="flex aspect-[3/2] items-center justify-center p-6 max-h-[200px]">
                {data.user.profile.avatar && (
                  <Image
                    src={resolve(data?.user?.profile?.avatar.presignedUrl)}
                    className="my-auto"
                  />
                )}
                <DragZone uploadFile={uploadFile} createFile={createFile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LokUser.ModelPage>
  );
});

export default Page;
