import { FormDialog } from "@/components/dialog/FormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  useListReleasesQuery,
  usePullFlavourMutation,
} from "@/port-next/api/graphql";
import { withPort } from "@jhnnsrs/port-next";
import { DropdownMenuIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import InstallForm from "../forms/InstallForm";

const Wrapper = () => {
  const { data, error, subscribeToMore, refetch } = withPort(
    useListReleasesQuery,
  )({
    variables: {},
  });

  const [pull] = withPort(usePullFlavourMutation)();

  return (
    <>
      {error && <div>Error: {error.message}</div>}
      <Carousel className="p-1 max-w-[90vw] relative">
        <CarouselContent className="">
          {data?.releases.map((item) => {
            return (
              <CarouselItem
                key={item.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3 overflow-hidden"
              >
                <Card className="overflow-hidden">
                  <CardContent
                    className="p-0 group flex aspect-square items-end relative  rounded bg-gray-100"
                    style={{ backgroundColor: item.colour }}
                  >
                    <div className="flex flex-col w-full bg-black bg-opacity-80 p-6 gap-1">
                      <div className="flex flex-row justify-between w-full">
                        <div className="flex flex-col">
                          <span className="text-2xl font-semibold">
                            {item.app.identifier}
                          </span>
                          <span className="text-md font-light">
                            {item.version}
                          </span>
                          <span className="text-sm font-light">
                            {item.description}
                          </span>
                        </div>
                        <div className="flex flex-row items-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant={"ghost"}>
                                <DropdownMenuIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {item.flavours.map((flavour) => (
                                <>
                                  <DropdownMenuItem
                                    onSelect={() => {
                                      if (flavour.pulled) {
                                        return;
                                      } else {
                                        pull({
                                          variables: {
                                            id: flavour.id,
                                          },
                                        });
                                      }
                                    }}
                                  >
                                    {flavour.pulled ? "Install" : "Download"}{" "}
                                    {flavour.name}
                                  </DropdownMenuItem>
                                </>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <FormDialog
                            trigger={
                              <Button variant={"ghost"}>
                                <PlusCircledIcon />
                              </Button>
                            }
                            onSubmit={async () => {
                              await refetch();
                            }}
                          >
                            <InstallForm release={item} />
                          </FormDialog>
                        </div>
                      </div>
                      {item.flavours
                        .filter(
                          (flavour) => flavour.latestUpdate.status != "Pulled",
                        )
                        .map((flavour) => (
                          <>
                            <Progress
                              value={
                                (flavour.latestUpdate.progress || 0.2) * 100
                              }
                            />
                          </>
                        ))}
                    </div>

                    <div className="group-hover:block hidden absolute bottom-4 right-4"></div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default Wrapper;
