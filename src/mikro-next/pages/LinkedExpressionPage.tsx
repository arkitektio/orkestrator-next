import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { MikroEntity, MikroExpression, MikroLinkedExpression } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import {
  useGetExpressionQuery,
  useGetLinkedExpressionQuery,
  useUpdateExpressionMutation,
} from "../api/graphql";
import LinkedExpressionCard from "../components/cards/LinkedExpressionCard";
import { UpdateExpressionForm } from "../forms/UpdateExpressionForm";
import { Badge } from "@/components/ui/badge";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LinkExpressionForm from "../forms/LinkExpressionForm";
import { EntitiesTable } from "../components/tables/EntitiesTable";

export default asDetailQueryRoute(
  useGetLinkedExpressionQuery,
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

    const navigate = useNavigate();

    return (
      <MikroExpression.ModelPage
        object={data.linkedExpression.id}
        title={data?.linkedExpression.expression.label}
        sidebars={
          <MikroExpression.Komments object={data.linkedExpression.id} />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <></>
          </div>
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.linkedExpression.expression.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.linkedExpression.expression.ontology.name}
            </p>
            <p className="mt-3 text-xl text-muted-foreground">
              <Badge>{data.linkedExpression.expression.kind}</Badge>
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.linkedExpression.expression?.store?.presignedUrl && (
              <Image
                src={resolve(
                  data.linkedExpression.expression?.store.presignedUrl,
                )}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>
        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <EntitiesTable graph={data.linkedExpression.graph.id} />
      </MikroExpression.ModelPage>
    );
  },
);
