import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { Badge } from "@/components/ui/badge";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { KraphStructureRelation } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetStructureRelationQuery } from "../api/graphql";
import { DisplayWidget } from "@/command/Menu";

export default asDetailQueryRoute(useGetStructureRelationQuery, ({ data, refetch }) => {
  const uploadFile = useMediaUpload();

  return (
    <KraphStructureRelation.ModelPage
      object={data.structureRelation.id}
      title={data?.structureRelation.category.label}
      sidebars={<KraphStructureRelation.Komments object={data.structureRelation.id} />}
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
            {data.structureRelation.category.label}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground"></p>
          <p className="mt-3 text-xl text-muted-foreground">
            <Badge>{data.structureRelation.id}</Badge>
          </p>
          {data.structureRelation.source.__typename == "Structure" && (
            <DisplayWidget
              identifier={data.structureRelation.source.identifier}
              object={data.structureRelation.source.object}
            />
          )}
          ----
          {data.structureRelation.target.__typename == "Structure" && (
            <DisplayWidget
              identifier={data.structureRelation.target.identifier}
              object={data.structureRelation.target.object}
            />
          )}
        </div>
      </div>
    </KraphStructureRelation.ModelPage>
  );
});
