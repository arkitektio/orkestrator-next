import { Arkitekt } from "@/arkitekt";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LokRoom } from "@/linkers";
import { useRoomsQuery } from "../api/graphql";

export const Test = () => {
  return <div>Hallo</div>;
};

export const PopularCarousel = ({}) => {
  const { data, error, subscribeToMore, refetch } = Arkitekt.withLok(
    useRoomsQuery,
  )({
    variables: {},
  });

  return (
    <div className="w-full">
      <Carousel className="w-full dark:text-white">
        <CarouselPrevious />
        <CarouselContent>
          {data?.rooms.map((item, index) => (
            <CarouselItem key={index} className="grid grid-cols-6">
              <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <p className="mt-3 text-xl text-muted-foreground">
                    Your latest conversion in
                  </p>
                  <LokRoom.DetailLink object={item.id}>
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                      {item.title}
                    </h1>
                    <p className="mt-3 text-xl text-muted-foreground">
                      {item.description}
                    </p>
                  </LokRoom.DetailLink>
                </div>
              </div>
              <div className="col-span-2">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6 ">
                      <div className="flex flex-col">
                        {item.messages.map((message) => (
                          <span key={message.id} className="text-sm">
                            {message.text}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
};
