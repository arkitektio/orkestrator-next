import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import {
  useCreateStructureMutation,
  useGetKnowledgeViewsQuery,
} from "../api/graphql";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";

export const ProtectedTinyStructureBox = (props: {
  identifier: string;
  object: string;
}) => {
  const { data, loading, error, refetch } = useGetKnowledgeViewsQuery({
    variables: {
      identifier: props.identifier,
      object: props.object,
    },
  });

  const [addStructure] = useCreateStructureMutation({});

  return (
    <Carousel className="w-full dark:text-white">
      <CarouselPrevious />
      <CarouselContent>
        {data?.knowledgeViews.map((view) => (
          <CarouselItem key={view.structureCategory.id}>
            <Card className="p-3 ">
              <h3 className="text-scroll font-semibold text-xs">
                {view.structureCategory.graph.name}
              </h3>
              {view.structure ? (
                <div className="h-64">
                  {view.structure?.bestView ? (
                    <SelectiveNodeViewRenderer view={view.structure.bestView} options={{ minimal: true }} />
                  ) : (
                    "No view available"
                  )}
                </div>
              ) : (
                <div className="flex flex-col w-full gap-2">
                  <p className="text-sm text-scroll font-light">
                    Not connected yet to Graph
                  </p>
                  <ObjectButton
                    identifier={props.identifier}
                    object={props.object}
                  >
                    <Button>Connect</Button>
                  </ObjectButton>
                </div>
              )}
            </Card>
          </CarouselItem>
        ))}
        {data?.knowledgeViews.length == 0 && (
          <CarouselItem>
            <Card className="p-3 flex flex-col gap-2">
              <h3 className="text-scroll font-semibold text-xs">
                No pinned Graphs. Pin some graphs to see them here.
              </h3>
            </Card>
          </CarouselItem>
        )}
        {error && (
          <CarouselItem className="grid grid-cols-12">
            <p>Error: {error.message}</p>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
};

export const TinyStructureBox = (props: {
  identifier: string;
  object: string;
}) => {
  return (
    <Guard.Kraph>
      <ProtectedTinyStructureBox
        identifier={props.identifier}
        object={props.object}
      />
    </Guard.Kraph>
  );
};
