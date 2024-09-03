import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { MikroExpression } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import {
  useGetExpressionQuery,
  useUpdateExpressionMutation,
} from "../api/graphql";
import LinkedExpressionCard from "../components/cards/LinkedExpressionCard";
import { UpdateExpressionForm } from "../forms/UpdateExpressionForm";

export default asDetailQueryRoute(
  useGetExpressionQuery,
  ({ data, refetch }) => {
    const uploadFile = useMediaUpload();

    const [update] = useUpdateExpressionMutation();
    const resolve = useResolve();

    const createFile = async (file: File, key: string) => {
      update({
        variables: {
          input: {
            id: data.expression.id,
            image: key,
          },
        },
      });
    };

    return (
      <MikroExpression.ModelPage
        object={data.expression.id}
        title={data?.expression.label}
        pageActions={
          <FormSheet trigger={<HobbyKnifeIcon />}>
            {data?.expression && (
              <UpdateExpressionForm expression={data?.expression} />
            )}
          </FormSheet>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.expression.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.expression.description}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.expression?.store?.presignedUrl && (
              <Image
                src={resolve(data.expression?.store.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <div className="flex flex-col p-6">
          <p className="text-xxl">Appears in </p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {data.expression.linkedExpressions.map((l) => (
              <LinkedExpressionCard key={l.id} item={l} />
            ))}
          </div>
        </div>
      </MikroExpression.ModelPage>
    );
  },
);
