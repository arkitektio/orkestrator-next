import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { GetKnowledgeViewsQuery } from "../api/graphql";
import { KnowledgeViewCard } from "./KnowledgeViewCard";

interface KnowledgeViewCarouselProps {
  knowledgeViews: GetKnowledgeViewsQuery["knowledgeViews"];
  error?: Error | null;
  onConnect: (graphId: string) => void;
  onConnectWithMeasurement: (graphId: string) => void;
}

export const KnowledgeViewCarousel = ({
  knowledgeViews,
  error,
  onConnect,
  onConnectWithMeasurement,
}: KnowledgeViewCarouselProps) => {
  return (
    <Carousel className="w-full dark:text-white">
      <CarouselPrevious />
      <CarouselContent>
        {knowledgeViews.map((view) => (
          <CarouselItem key={view.structureCategory.id}>
            <KnowledgeViewCard
              view={view}
              onConnect={onConnect}
              onConnectWithMeasurement={onConnectWithMeasurement}
            />
          </CarouselItem>
        ))}
        {knowledgeViews.length === 0 && (
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
