import { error } from "console";
import { useGetActiveGraphStructuresQuery } from "../api/graphql";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Guard } from "@/arkitekt/Arkitekt";

export const ProtectedTinyStructureBox = (props: {
  identifier: string;
  object: string;
}) => {
  const { data, loading, error } = useGetActiveGraphStructuresQuery({
    variables: {
      identifier: props.identifier,
      object: props.object,
    },
  });

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (!data) return <div>Loading...</div>;

  return (
    <Carousel className="w-full dark:text-white">
      <CarouselPrevious />
      <CarouselContent>
        {data.activeGraphStructuresForIdentifier.map((structure) => (
          <CarouselItem key={structure.id}>
            <Card className="p-3 h-64">
              <h3 className="text-scroll font-semibold text-xs">
                {structure.graph.name}
              </h3>
              {structure.bestView ? (
                <SelectiveNodeViewRenderer view={structure.bestView} />
              ) : (
                "No view available"
              )}
            </Card>
          </CarouselItem>
        ))}
        {data.activeGraphStructuresForIdentifier.length == 0 && (
          <CarouselItem>
            <Card className="p-3">
              This identifier has no active graph structures. Create one now
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
