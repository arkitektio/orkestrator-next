import { useRoomsQuery } from "@/alpaka/api/graphql";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LokComment } from "@/linkers";
import { Username } from "@/lok-next/components/Me";

export const Test = () => {
  return <div>Hallo</div>;
};

export default ({ }) => {
  const { data, error, subscribeToMore, refetch } = useRoomsQuery({});

  if (!data?.rooms) {
    return null;
  }

  return (
    <div className="w-full">
      {error && <div>Error: {error.message}</div>}
      {JSON.stringify(error)}
      {data?.rooms.length > 0 && (
        <Carousel className="w-full dark:text-white">
          <CarouselPrevious />
          <CarouselContent>
            {data?.rooms?.map((item, index) => (
              <CarouselItem key={index} className="grid grid-cols-6">
                <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                  <div>
                    <LokComment.DetailLink
                      object={item.id}
                      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                    >
                      {item.title}
                    </LokComment.DetailLink>
                  </div>
                </div>
                <div className="col-span-2">
                  <LokComment.DetailLink object={item.id} className="p-1">
                    <Card>
                      <CardContent className="flex aspect-[3/2] items-center justify-center p-6">
                        <p className="mt-3 text-xl text-muted-foreground">
                          {item.messages
                            .map((message) => message.text)
                            .join(" ")}
                        </p>
                      </CardContent>
                    </Card>
                  </LokComment.DetailLink>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      )}
      {data?.rooms.length == 0 && (
        <Carousel className="w-full dark:text-white">
          <CarouselPrevious />
          <CarouselContent>
            <CarouselItem key={0} className="grid grid-cols-6">
              <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <div className="scroll-m-20 text-2xl  tracking-tight lg:text-3xl">
                    Hi there
                  </div>
                  <p className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {" "}
                    <Username /> :)
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-[3/2] items-center justify-center p-6 flex flex-col">
                      <p className="mt-3 text-xl text-muted-foreground">
                        No rooms yet :(
                      </p>
                      <p className=" text-xs text-muted-foreground">
                        Just create room and discuss your data
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};
