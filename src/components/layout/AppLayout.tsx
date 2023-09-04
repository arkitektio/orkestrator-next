export type AppLayoutProps = {
  navigationBar: React.ReactNode;
  children: React.ReactNode;
};

export const AppLayout = ({ children, navigationBar }: AppLayoutProps) => {
  return (
    <div className="flex flex-col h-screen sm:flex-row-reverse">
      <div className="flex-grow flex overflow-y-auto">{children}</div>
      <div className="flex-initial sm:flex-initial sm:static sm:w-20 px-1 border-r-2 border-gray-700">
        {navigationBar}
      </div>
    </div>
  );
};
