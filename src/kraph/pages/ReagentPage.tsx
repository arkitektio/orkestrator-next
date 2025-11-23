import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KraphReagent, KraphReagentCategory } from "@/linkers";
import { HobbyKnifeIcon, PinRightIcon } from "@radix-ui/react-icons";
import { Database, FlaskConical, Tag } from "lucide-react";
import { useGetReagentQuery } from "../api/graphql";
import { PropertyEditor } from "../components/PropertyEditor";
import { PropertyRenderer } from "../components/PropertyRenderer";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import CreateNodeQueryForm from "../forms/CreateNodeQueryForm";

export default asDetailQueryRoute(useGetReagentQuery, ({ data, refetch }) => {
  return (
    <KraphReagent.ModelPage
      variant="black"
      object={data.reagent.id}
      title={
        <>
          <div className="flex flex-row">
            {data.reagent.category.label}{" "}
            <div className="ml-2 text-md font-light">{data.reagent.label}</div>
          </div>
        </>
      }
      sidebars={
        <MultiSidebar
          map={{ Comments: <KraphReagent.Komments object={data.reagent.id} /> }}
        />
      }
      pageActions={
        <div className="flex flex-row gap-2">
          <FormSheet trigger={<Button variant="outline" size="icon"><HobbyKnifeIcon /></Button>}>Not implemented</FormSheet>
          <FormSheet
            trigger={<Button variant="outline">New Query</Button>}
            onSubmit={() => refetch()}
          >
            <CreateNodeQueryForm entity={data.reagent} />
          </FormSheet>
          <KraphReagent.ObjectButton
            object={data.reagent.id}
            className="w-full"
          />
        </div>
      }
    >
      <div className="flex flex-col lg:flex-row h-full min-h-[80vh]">
        {/* Left Column: Info */}
        <div className="w-full lg:w-[450px] xl:w-[500px] flex-shrink-0 flex flex-col gap-8 p-4 lg:p-8 lg:overflow-y-auto lg:h-full lg:border-r bg-black z-20">
          {/* Metadata */}
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex flex-row">
            {data.reagent.category.label}{" "}
            <div className="ml-2 text-md font-light">{data.reagent.label}</div>
          </h1>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" /> Metadata
            </h3>
            <div className="grid gap-4 pl-2">
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Category
                </span>
                <KraphReagentCategory.DetailLink
                  object={data.reagent.category.id}
                  className="text-sm font-medium hover:underline"
                >
                  {data.reagent.category.label}
                </KraphReagentCategory.DetailLink>
              </div>
              {data.reagent.externalId && (
                <div className="grid gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    External ID
                  </span>
                  <span className="text-sm">{data.reagent.externalId}</span>
                </div>
              )}
              {data.reagent.tags && data.reagent.tags.length > 0 && (
                <div className="grid gap-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Tag className="h-3 w-3" /> Tags
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {data.reagent.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {data.reagent.pinned && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PinRightIcon className="h-4 w-4" /> Pinned
                </div>
              )}
            </div>
          </div>

          {(data.reagent.category.propertyDefinitions?.length ?? 0) > 0 ? (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Properties</h3>
                <div className="grid gap-2 pl-2">
                  {data.reagent.category.propertyDefinitions?.map((def) => {
                    const prop = data.reagent.propertyList.find(
                      (p) => p.key === def.key,
                    );
                    return (
                      <div
                        key={def.key}
                        className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0 group"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-muted-foreground">
                            {def.label || def.key}
                          </span>
                          {def.description && (
                            <span className="text-xs text-muted-foreground/50">
                              {def.description}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <PropertyRenderer
                            value={prop?.value}
                            definition={def}
                          />
                          <PropertyEditor
                            entityId={data.reagent.id}
                            definition={def}
                            value={prop?.value}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            data.reagent.propertyList.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Properties</h3>
                  <div className="grid gap-2 pl-2">
                    {data.reagent.propertyList.map((property) => (
                      <div
                        key={property.key}
                        className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0"
                      >
                        <span className="text-sm font-medium text-muted-foreground">
                          {property.key}
                        </span>
                        <span className="text-sm">{property.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          )}

          {data.reagent.usableIn.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" /> Usable In
                </h3>
                <div className="grid gap-2 pl-2">
                  {data.reagent.usableIn.map((cat) => (
                    <div key={cat.id} className="text-sm">
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {data.reagent.createableFrom.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" /> Createable From
                </h3>
                <div className="grid gap-2 pl-2">
                  {data.reagent.createableFrom.map((cat) => (
                    <div key={cat.id} className="text-sm">
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Node View */}
        <div className="flex-1 relative min-h-[500px] lg:min-h-auto">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden lg:block" />
          <div className="absolute inset-0 overflow-hidden">
            {data.reagent.bestView ? (
              <SelectiveNodeViewRenderer view={data.reagent.bestView} />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                <p className="mb-4">No Node Query configured</p>
                <FormDialog
                  trigger={<Button variant="outline">Create Query</Button>}
                  onSubmit={() => refetch()}
                >
                  <CreateNodeQueryForm entity={data.reagent} />
                </FormDialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </KraphReagent.ModelPage>
  );
});
