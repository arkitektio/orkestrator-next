import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";
import { DragZone } from "@/components/upload/drag";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { MikroExpression } from "@/linkers";
import { useNavigate } from "react-router-dom";
import {
  ExpressionKind,
  useGetLinkedExpressionQuery,
  useUpdateExpressionMutation,
} from "../api/graphql";
import { LinkedExpressionEntitiesTable } from "../components/tables/LinkedExpressionEntityTable";
import { LinkedExpressionRelationTable } from "../components/tables/LinkedExpressionRelationTable";

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
              {data.linkedExpression.graph.name}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
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
        <div className="p-6 h-full">
          {data.linkedExpression.expression.kind == ExpressionKind.Entity && (
            <LinkedExpressionEntitiesTable
              graph={data.linkedExpression.graph.id}
              linkedExpression={data.linkedExpression.id}
            />
          )}
          {data.linkedExpression.expression.kind == ExpressionKind.Relation && (
            <LinkedExpressionRelationTable
              graph={data.linkedExpression.graph.id}
              linkedExpression={data.linkedExpression.id}
            />
          )}
        </div>
      </MikroExpression.ModelPage>
    );
  },
);