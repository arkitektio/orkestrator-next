import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { KraphNodeQuery, KraphStructure, KraphStructureCategory } from "@/linkers";
import { PortKind } from "@/rekuest/api/graphql";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { useGetStructureQuery } from "../api/graphql";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import CreateStructureNodeQueryForm from "../forms/CreateStructureNodeQueryForm";
import CreateNodeQueryForm from "../forms/CreateNodeQueryForm";
import { useDisplayComponent } from "@/app/display";
import { DisplayWidget } from "@/command/Menu";

export default asDetailQueryRoute(useGetStructureQuery, ({ data, refetch }) => {
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
        {data.structure.relevantQueries.map((query) => (
          <Card key={query.id} className="p-2 m-2 flex-row gap-2 flex">
            <KraphNodeQuery.DetailLink
              object={query.id}
              className="w-full"
              subroute="view"
              subobject={data.structure.id}
            >
              {query.name}
            </KraphNodeQuery.DetailLink>
          </Card>
        ))}
      </div>

      <div className="flex flex-col p-6 h-full">
        {data.structure.bestView ? (
          <SelectiveNodeViewRenderer view={data.structure.bestView} />
        ) : (
          <div className="h-ful w-ull flex flex-col items-center justify-center">
            <p className="text-sm font-light mb-3">
              No Graph Query yet for this category
            </p>
            <FormDialog
              trigger={<Button variant="outline">Create Query</Button>}
              onSubmit={() => refetch()}
            >
              <CreateStructureNodeQueryForm structure={data.structure} />
            </FormDialog>
          </div>
        )}
      </div>
    </KraphStructure.ModelPage>
  );
});
