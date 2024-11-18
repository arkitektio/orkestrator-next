import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ChildMap = {
  [key: string]: React.ReactNode;
};

export const MultiSidebar = (props: { map: ChildMap | undefined }) => {
  return (
    <Tabs
      defaultValue={props.map && Object.keys(props.map).at(0)}
      className="w-full h-full"
    >
      <TabsList className="w-full flex flex-row h-16 p-2 bg-sidebar border-b dark:border-gray-700 rounded-xs ">
        {props.map &&
          Object.keys(props.map).map((key) => {
            return (
              <TabsTrigger
                value={key}
                className="flex-1 h-full text-md truncate px-2"
              >
                {key}
              </TabsTrigger>
            );
          })}
      </TabsList>
      {props.map &&
        Object.keys(props.map).map((key) => {
          return (
            <TabsContent value={key} className="h-full">
              {props.map && props.map[key]}
            </TabsContent>
          );
        })}
    </Tabs>
  );
};
