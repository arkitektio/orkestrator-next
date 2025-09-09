import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useListProtocolEventCategoriesQuery } from "@/kraph/api/graphql";
import { PlateDisplay } from "@/kraph/pages/ProtocolEventCategoryPage";
import {
  KraphProtocolEventCategory,
  KraphProtocolStepTemplate,
} from "@/linkers";

export const Test = () => {
  return <div>Hallo</div>;
};

export const PopularProtocolEventCategories = ({ }) => {
  const { data, error, subscribeToMore, refetch } =
    useListProtocolEventCategoriesQuery({
      variables: {
        filters: {},
        pagination: { offset: 0, limit: 10 },
      },
    });

  return (
    <div className="w-full">
      {error && <div>Error: {error.message}</div>}
      {JSON.stringify(error)}
      <Carousel className="w-full dark:text-white">
        <CarouselPrevious />
        <CarouselContent>
          {data?.protocolEventCategories.map((item, index) => (
            <CarouselItem key={index} className="grid grid-cols-6">
              <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <KraphProtocolEventCategory.DetailLink
                    object={item.id}
                    className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                  >
                    {item.label}
                  </KraphProtocolEventCategory.DetailLink>
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
                        {item.plateChildren && (
                          <PlateDisplay plates={item.plateChildren} />
                        )}
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
