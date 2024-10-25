import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MikroProtocolStepTemplate } from "@/linkers";
import { useListProtocolStepTemplatesQuery } from "@/mikro-next/api/graphql";
import { PlateDisplay } from "@/mikro-next/pages/ProtocolStepTemplatePage";

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
                  <MikroProtocolStepTemplate.DetailLink
                    object={item.id}
                    className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                  >
                    {item.name}
                  </MikroProtocolStepTemplate.DetailLink>
                </div>
              </div>
              <div className="col-span-2">
                <MikroProtocolStepTemplate.DetailLink
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
                </MikroProtocolStepTemplate.DetailLink>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
};
