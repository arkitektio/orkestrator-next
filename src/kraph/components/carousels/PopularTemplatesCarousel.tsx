import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { KraphProtocolStepTemplate } from "@/linkers";
import { PlateDisplay } from "@/kraph/pages/ProtocolStepTemplatePage";
import { useListProtocolStepTemplatesQuery } from "@/kraph/api/graphql";

export const Test = () => {
  return <div>Hallo</div>;
};

export const PopularTemplatesCarousel = ({}) => {
  const { data, error, subscribeToMore, refetch } =
    useListProtocolStepTemplatesQuery({
      variables: {
        order: {},
      },
    });

  return (
    <div className="w-full">
      {error && <div>Error: {error.message}</div>}
      {JSON.stringify(error)}
      <Carousel className="w-full dark:text-white">
        <CarouselPrevious />
        <CarouselContent>
          {data?.protocolStepTemplates.map((item, index) => (
            <CarouselItem key={index} className="grid grid-cols-6">
              <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <KraphProtocolStepTemplate.DetailLink
                    object={item.id}
                    className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                  >
                    {item.name}
                  </KraphProtocolStepTemplate.DetailLink>
                </div>
              </div>
              <div className="col-span-2">
                <KraphProtocolStepTemplate.DetailLink
                  object={item.id}
                  className="p-1"
                >
                  <Card>
                    <CardContent className="flex aspect-[3/2] items-center justify-center p-6">
                      <p className="mt-3 text-xl text-muted-foreground">
                        <PlateDisplay step={item} />
                      </p>
                    </CardContent>
                  </Card>
                </KraphProtocolStepTemplate.DetailLink>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
};
