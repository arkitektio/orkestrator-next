import { ScrollArea } from "../ui/scroll-area";

export type AppLayoutProps = {
  children: React.ReactNode;
  searchBar: React.ReactNode;
};

export const SidebarLayout = ({ children, searchBar }: AppLayoutProps) => {
  return (
    <div className="flex h-full flex-col " data-enableselect={true}>
      <div className="flex-initial h-16 border-b-gray-600 flex px-2 py-2 border-b border-1">
        {searchBar}
      </div>

      <ScrollArea
        className="flex-grow flex flex-col gap-2 p-3 direct @container"
        data-enableselect={true}
      >
        {children}
      </ScrollArea>
    </div>
  );
};
