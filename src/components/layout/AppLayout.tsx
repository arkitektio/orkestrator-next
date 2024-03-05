import ShadowRealm from "shadowrealm-api";

export type AppLayoutProps = {
  navigationBar: React.ReactNode;
  children: React.ReactNode;
};

export const AppLayout = ({ children, navigationBar }: AppLayoutProps) => {
  const realm = new ShadowRealm();

  let x = realm.evaluate("(sourceText) => sourceText") as Function;
  console.log(x("hello world"));
  return (
    <div className="flex flex-col h-screen sm:flex-row">
      <div className="flex-initial px-2 z-10 w-19 shadow shadow-xl border-r border-gray-500 overflow-x-auto">
        {navigationBar}
      </div>
      hallo
      <div className="flex-grow flex overflow-y-auto z-2">{children}</div>
    </div>
  );
};
