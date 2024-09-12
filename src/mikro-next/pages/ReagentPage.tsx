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
  useGetReagentQuery,
  useUpdateExpressionMutation,
} from "../api/graphql";
import LinkedExpressionCard from "../components/cards/LinkedExpressionCard";
import { UpdateExpressionForm } from "../forms/UpdateExpressionForm";
import { Badge } from "@/components/ui/badge";
import { FormDialogAction } from "@/components/ui/form-dialog-action";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LinkExpressionForm from "../forms/LinkExpressionForm";

export default asDetailQueryRoute(useGetReagentQuery, ({ data, refetch }) => {
  const uploadFile = useMediaUpload();

  const [update] = useUpdateExpressionMutation();
  const resolve = useResolve();

  const createFile = async (file: File, key: string) => {
    update({
      variables: {
        input: {
          id: data.reagent.id,
          image: key,
        },
      },
    });
  };

  const navigate = useNavigate();

  return (
    <MikroExpression.ModelPage
      object={data.reagent.id}
      title={data?.reagent.label}
      sidebars={<MikroExpression.Komments object={data.reagent.id} />}
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormSheet trigger={<HobbyKnifeIcon />}>Not implemented</FormSheet>
          </>
        </div>
      }
    >
      <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.reagent.label}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground"></p>
          <p className="mt-3 text-xl text-muted-foreground">
            <Badge>{data.reagent.id}</Badge>
          </p>
        </div>
      </div>
      <DragZone uploadFile={uploadFile} createFile={createFile} />

      <div className="flex flex-col p-6">
        <p className="text-sm font-light">Appears in </p>
      </div>
    </MikroExpression.ModelPage>
  );
});
