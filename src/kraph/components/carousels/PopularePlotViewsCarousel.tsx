import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  GraphQueryFragment
} from "@/kraph/api/graphql";
import {
  KraphGraphQuery,
  KraphScatterPlot
} from "@/linkers";
import ScatterPlot from "../charts/scatterplot/ScatterPlot";

export const Test = () => {
  return <div>Hallo</div>;
};

export default (props: { queries: GraphQueryFragment[] }) => {
  return (
    <div className="w-full">
      <Carousel className="w-full dark:text-white">
        <CarouselPrevious />
        <CarouselContent>
          {props?.queries.map((item, index) => (
            <CarouselItem key={index} className="grid grid-cols-12">
              <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <KraphGraphQuery.DetailLink
                    object={item.id}
                    className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                  >
                    {item.name}
                  </KraphGraphQuery.DetailLink>
                </div>
              </div>
              <div className="col-span-8">
                {item.scatterPlots.map((plot) => (
                  <KraphScatterPlot.DetailLink object={plot.id} key={plot.id}>
                    {item.render.__typename == "Table" && (
                      <ScatterPlot scatterPlot={plot} table={item.render} />
                    )}
                  </KraphScatterPlot.DetailLink>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
};
