import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useLokUpload } from "@/datalayer/hooks/useLokUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokGroup } from "@/linkers";
import {
  useCreateGroupProfileMutation,
  useDetailGroupQuery,
  useUpdateGroupProfileMutation,
} from "../api/graphql";
import UserCard from "../components/cards/UserCard";

export default asDetailQueryRoute(useDetailGroupQuery, ({ data }) => {
  const uploadFile = useLokUpload();

  const resolve = useResolve();
  const [update] = useUpdateGroupProfileMutation();
  const [create] = useCreateGroupProfileMutation();

  const createFile = async (file: File, key: string) => {
    if (!data.group.profile)
      create({
        variables: {
          input: {
            group: data.group.id,
            avatar: key,
            name: data.group.name,
          },
        },
      });
    else
      update({
        variables: {
          input: {
            id: data.group.profile.id,
            avatar: key,
            name: data.group.name,
          },
        },
      });
  };

  return (
    <LokGroup.ModelPage
      object={data.group.id}
      actions={<LokGroup.Actions object={data?.group?.id} />}
      title={data?.group?.name}
      sidebars={<LokGroup.Komments object={data?.group?.id} />}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.group.name}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-[3/2] items-center justify-center p-6 max-h-[200px]">
                {data.group.profile?.avatar && (
                  <Image
                    src={resolve(data?.group?.profile?.avatar.presignedUrl)}
                    className="my-auto"
                  />
                )}
                <DragZone uploadFile={uploadFile} createFile={createFile} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ListRender array={data?.group?.users}>
        {(item) => <UserCard item={item} />}
      </ListRender>
    </LokGroup.ModelPage>
  );
});
