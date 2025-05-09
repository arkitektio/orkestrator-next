import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import { RekuestAgent, RekuestImplementation } from "@/linkers";
import { AgentFragment } from "@/rekuest/api/graphql";
import Timestamp from "react-timestamp";

export default (props: { agent: AgentFragment }) => {
  return (
    <div className="w-full">
      <Carousel className="w-full dark:text-white">
        <CarouselPrevious />
        <CarouselContent>
          <CarouselItem key={"root"} className="grid grid-cols-8">
            <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-10 md:items-center p-6">
              <div>
                <p className="mt-3 text-xl text-muted-foreground">
                  last Seen: <Timestamp date={props.agent.lastSeen} relative />
                </p>
                <RekuestAgent.DetailLink object={props.agent.id}>
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {props.agent.name}
                  </h1>
                  <p className="mt-3 text-xl text-muted-foreground flex flex-row gap-2">
                    {props.agent.connected && "Connected"}{" "}
                    <div
                      className="w-3 h-3 rounded rounded-full my-auto animate-pulse"
                      style={{
                        backgroundColor:
                          props.agent.connected
                            ? "#00FF00"
                            : "#FF0000",
                      }}
                    />
                  </p>
                </RekuestAgent.DetailLink>
              </div>
            </div>
            <div className="col-span-4 h-full">
              <Card className="w-full h-full">
                <CardContent className="w-full h-full p-6 ">
                  <div className="w-full h-full">{props.agent.connected}</div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          {props.agent?.implementations.map((item, index) => (
            <CarouselItem key={index} className="grid grid-cols-8">
              <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <p className="mt-3 text-xl text-muted-foreground">
                    {item.action.name}
                  </p>
                  <RekuestImplementation.DetailLink object={item.id}>
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                      {item.agent.name}
                    </h1>
                    <p className="mt-3 text-xl text-muted-foreground">
                      {item.action.description && (
                        <ActionDescription description={item.action.description} />
                      )}
                    </p>
                  </RekuestImplementation.DetailLink>
                </div>
              </div>
              <div className="col-span-4">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square max-h-[200px] p-6 ">
                      <div className="w-full h-full">{item.action.name}</div>
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
