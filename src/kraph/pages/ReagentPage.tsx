import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { Badge } from "@/components/ui/badge";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { KraphReagent } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetReagentQuery } from "../api/graphql";

export default asDetailQueryRoute(useGetReagentQuery, ({ data, refetch }) => {
  const uploadFile = useMediaUpload();

  return (
    <KraphReagent.ModelPage
      object={data.reagent.id}
      title={data?.reagent.label}
      sidebars={<KraphReagent.Komments object={data.reagent.id} />}
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

      <div className="flex flex-col p-6">
        <p className="text-sm font-light">Appears in </p>
      </div>

      <div className="flex flex-col p-6">
        {data.reagent.usableIn.map((cat) => (
          <>
            {cat.label}
            OHJAES
            <br />
          </>
        ))}
      </div>
      <div className="flex flex-col p-6">
        {data.reagent.createableFrom.map((cat) => (
          <>
            {cat.label}
            OHJAES
            <br />
          </>
        ))}
      </div>
    </KraphReagent.ModelPage>
  );
});
