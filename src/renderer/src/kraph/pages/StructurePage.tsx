import { useDisplayComponent } from "@/app/display";
import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { DisplayWidget } from "@/command/Menu";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { KraphNodeQuery, KraphStructure, KraphStructureCategory } from "@/linkers";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetStructureQuery } from "../api/graphql";
import CreateStructureNodeQueryForm from "../forms/CreateStructureNodeQueryForm";

const Page =  asDetailQueryRoute(useGetStructureQuery, ({ data, refetch }) => {
  const uploadFile = useMediaUpload();

  const Widget = useDisplayComponent(data.structure.identifier || "");

  return (
    <KraphStructure.ModelPage
      object={data.structure.id}
      title={data?.structure.identifier}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <KraphStructure.Komments object={data.structure.id} />,
          }}
        />
      }
      pageActions={
        <div className="flex flex-row gap-2">
          <>
            <FormSheet trigger={<HobbyKnifeIcon />}>Not implemented</FormSheet>
          </>
          <FormDialog
            trigger={<Button variant="outline">Create</Button>}
            onSubmit={() => refetch()}
          >
            <CreateStructureNodeQueryForm structure={data.structure} />
          </FormDialog>
        </div>
      }
    >
      <KraphStructure.Drop
        object={data.structure.id}
        className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6"
      >
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            <KraphStructureCategory.DetailLink object={data.structure.category.id} className="font-light text-muted-foreground">
              {data.structure.category.identifier}
            </KraphStructureCategory.DetailLink>{" "}{data.structure.object}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            {data.structure.label}
          </p>
        </div>
        <Card className="flex flex-row gap-2 p-4">
          <DisplayWidget
            identifier={data.structure.identifier}
            object={data.structure.object}
            link
          />
        </Card>
      </KraphStructure.Drop>

      <div>
        {data.structure.metrics?.map((metric) => (
          <div key={metric.id} className="px-6">
            <span className="font-semibold">{metric.category.label}:</span>{" "}
            {metric.value}
          </div>
        ))}
      </div>

      <div className="flex flex-row p-6">
        {data.structure.category.relevantNodeQueries.map((query) => (
          <Card key={query.id} className="p-2 m-2 flex-row gap-2 flex">
            <KraphNodeQuery.DetailLink
              object={query.id}
              className="w-full"
              subroute="view"
              subobject={data.structure.id}
            >
              {query.label}
            </KraphNodeQuery.DetailLink>
          </Card>
        ))}
      </div>
    </KraphStructure.ModelPage>
  );
});


export default Page;
