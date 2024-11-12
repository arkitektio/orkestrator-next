import { Option } from "@/components/fields/ListSearchField";
import { CommandInput } from "@/components/plate-ui/command";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/components/timeline/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notEmpty } from "@/lib/utils";
import { MikroEntityMetric, MikroROI, MikroSpecimenView } from "@/linkers";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useCallback, useEffect, useState } from "react";
import Timestamp from "react-timestamp";
import {
  ListProtocolStepTemplateFragment,
  useGetEntityQuery,
  useListProtocolStepsLazyQuery,
  useListProtocolStepTemplatesLazyQuery,
  useSearchProtocolStepTemplatesLazyQuery,
} from "../api/graphql";
import { ImageRGBD, RoiRGBD } from "../components/render/TwoDThree";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateProtocolStepForm from "../forms/CreateProtocolStepForm";
import { FormDialogContext } from "@/components/dialog/FormDialog";

export const PerformStepButton = (props: {
  entity: string;
  refetch: () => {};
}) => {
  const [latestQuery, setLatestQuery] = useState<string>("");

  const [options, setOptions] = useState<
    (ListProtocolStepTemplateFragment | null | undefined)[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const [lazySearch] = useListProtocolStepTemplatesLazyQuery();
  const debouncedQuery = useDebounce(latestQuery, 200);

  const [selectedOption, setSelectedOption] = useState<
    ListProtocolStepTemplateFragment | null | undefined
  >(null);

  const query = (string: string) => {
    lazySearch({ variables: { filters: { search: string } } })
      .then((res) => {
        setOptions(res.data?.protocolStepTemplates ?? []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const [open, setOpen] = React.useState(false);

  const onSubmit = useCallback(
    (v: any) => {
      console.log("submit");
      setSelectedOption(null);
      props.refetch();
    },
    [setSelectedOption],
  );

  const onError = useCallback(
    (e: any) => {
      console.log("error", e);
      setSelectedOption(null);
    },
    [setOpen],
  );

  useEffect(() => {
    query(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <Dialog
      open={selectedOption != undefined}
      onOpenChange={() => setSelectedOption(null)}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" size={"sm"}>
            Perform Step
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[80%] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={"Search Steps"}
              className="h-9"
              onValueChange={(e) => {
                setLatestQuery(e);
              }}
            />
            <CommandList>
              <CommandEmpty>No templates found </CommandEmpty>
              {error && (
                <CommandGroup heading="Error">
                  {error && <CommandItem>{error}</CommandItem>}
                </CommandGroup>
              )}
              <CommandGroup>
                {options.filter(notEmpty).map((option) => (
                  <CommandItem
                    value={option.name}
                    key={option.id}
                    onSelect={() => {
                      setSelectedOption(option);
                    }}
                  >
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <FormDialogContext.Provider value={{ onSubmit, onError }}>
          {selectedOption && (
            <CreateProtocolStepForm
              template={selectedOption}
              entity={props.entity}
            />
          )}
        </FormDialogContext.Provider>
      </DialogContent>
    </Dialog>
  );
};

export const EntitySidebar = (props: { entity: string }) => {
  const { data, refetch } = useGetEntityQuery({
    variables: {
      id: props.entity,
    },
  });

  const [relativeTime, setRelativeTime] = React.useState<Date | undefined>();

  return (
    <div className="w-full p-2">
      <Tabs defaultValue={"metrics"} className="w-full">
        <TabsList className="w-full flex flex-row h-12 bg-sidebar border-b dark:border-gray-700 rounded-xs">
          <TabsTrigger
            value={"metrics"}
            className="flex-1 h-full text-md truncate px-2"
          >
            Metrics
          </TabsTrigger>
          <TabsTrigger
            value={"steps"}
            className="flex-1 h-full text-md truncate px-2"
          >
            Steps
          </TabsTrigger>
          <TabsTrigger
            value={"measurements"}
            className="flex-1 h-full text-md truncate px-2"
          >
            Measurements
          </TabsTrigger>
        </TabsList>
        <TabsContent value={"metrics"}>
          <div className="grid grid-cols-2 gap-2">
            {data?.entity?.metrics.map((metric, i) => (
              <Card className="p-2 truncate">
                <MikroEntityMetric.DetailLink
                  object={metric.id}
                  className={"max-w-[80px] truncate "}
                >
                  {metric.linkedExpression.label}: {metric.value}
                </MikroEntityMetric.DetailLink>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value={"steps"}>
          <div className="h-full flex-col">
            {data?.entity && data.entity.subjectedTo.length === 0 && (
              <div className="p-2 truncate text-center w-full">
                No Recorded steps
              </div>
            )}

            <Timeline className="w-full p-2 flex-grow">
              {data?.entity?.subjectedTo.map((e) => (
                <TimelineItem className="w-full">
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon />
                    <TimelineTitle>{e.name}</TimelineTitle>
                  </TimelineHeader>
                  <TimelineContent>
                    <TimelineDescription>
                      <p
                        className="text-xs mb-1"
                        onMouseEnter={() => setRelativeTime(e.performedAt)}
                        onMouseLeave={() => setRelativeTime(undefined)}
                      >
                        <Timestamp
                          date={e.performedAt}
                          relative={relativeTime ? true : false}
                          relativeTo={relativeTime}
                        />
                      </p>
                      {e.name}
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            <div className="p-2 truncate text-center w-full flex-initial mt-3">
              <PerformStepButton entity={props.entity} refetch={refetch} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value={"measurements"}></TabsContent>
      </Tabs>
    </div>
  );
};
