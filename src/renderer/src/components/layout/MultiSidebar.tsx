import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export type ChildMap = {
  [key: string]: React.ReactNode;
};

const ACTIVE_SIDEBAR_KEY = "active-sidebar";

export const MultiSidebar = (props: { map: ChildMap | undefined , sidebarKey?: string}) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Load from local storage on initial render
    const saved = localStorage.getItem(props.sidebarKey || ACTIVE_SIDEBAR_KEY);
    const firstKey = props.map && Object.keys(props.map).at(0);

    // Validate that the saved tab still exists in the map
    if (saved && props.map && Object.keys(props.map).includes(saved)) {
      return saved;
    }

    return firstKey || "";
  });

  // Save to local storage whenever the active tab changes
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem(props.sidebarKey || ACTIVE_SIDEBAR_KEY, activeTab);
    }
  }, [activeTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-initial flex-col"
    >
      <div className="flex-initial h-16  flex px-2 py-2 1">
      <TabsList className="w-full flex gap-2 my-auto">
        {props.map &&
          Object.keys(props.map).map((key) => {
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="flex-1 h-full text-xs truncate px-2 py-1 cursor-pointer text-elevation-foreground/60 hover:text-elevation-foreground data-[state=active]:text-elevation-foreground data-[state=active]:bg-accent data-[state=active]:hover:bg-accent/90"
              >
                {key}
              </TabsTrigger>
            );
          })}
      </TabsList>
      </div>
      {props.map &&
        Object.keys(props.map).map((key) => {
          return (
            <TabsContent value={key} className="flex-grow">
              {props.map && props.map[key]}
            </TabsContent>
          );
        })}
    </Tabs>
  );
};
