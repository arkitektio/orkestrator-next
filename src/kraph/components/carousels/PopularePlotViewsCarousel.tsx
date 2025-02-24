import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { KraphPlotView, KraphProtocolStepTemplate } from "@/linkers";
import { PlateDisplay } from "@/kraph/pages/ProtocolStepTemplatePage";
import { CarouselPlotViewFragment, ListPlotViewFragment, useListProtocolStepTemplatesQuery } from "@/kraph/api/graphql";
import ScatterPlot from "../charts/scatterplot/ScatterPlot";

export const Test = () => {
  return <div>Hallo</div>;
};

export default  (props: {plots: CarouselPlotViewFragment[]}) => {
  

  return (
    <div className="w-full">
      <Carousel className="w-full dark:text-white">
        <CarouselPrevious />
        <CarouselContent>
          {props?.plots.map((item, index) => (
            <CarouselItem key={index} className="grid grid-cols-12">
              <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <KraphProtocolStepTemplate.DetailLink
                    object={item.id}
                    className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                  >
                    {item.name}
                  </KraphProtocolStepTemplate.DetailLink>
                  <p>
                    {item.plot.description || item.view.label}
                  </p>
                </div>
              </div>
              <div className="col-span-8">
                <KraphPlotView.DetailLink
                  object={item.id}
                  className="p-1"
                >
                  <ScatterPlot scatterPlot={item.plot} table={item.view.render}/>
                </KraphPlotView.DetailLink>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
};
