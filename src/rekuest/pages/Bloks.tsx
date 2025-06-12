import { PageLayout } from "@/components/layout/PageLayout";
import BlokList from "../components/lists/BlokList";
import { Button } from "@/components/ui/button";
import { useCreateBlokMutation } from "../api/graphql";
import registry from "@/blok/registry";

const Page = () => {

   const [createBlok] = useCreateBlokMutation();
  
    const createBloks = async () => {
      for (const [key, mod] of registry.modules.entries()) {
        console.log("Creating blok for", key, mod);
        if (mod.app) {
          const stateDemands = Object.keys(mod.app.states).map((key) => {
            return { key: key, ...mod.app.states[key].demand };
          });
  
          const actionDemands = Object.keys(mod.app.actions).map((key) => {
            return { key: key, ...mod.app.actions[key].demand };
          });
  
          let x = await createBlok({
            variables: {
              input: {
                name: mod.app.name,
                stateDemands: stateDemands,
                actionDemands: actionDemands,
                url: `orkestrator:///${key}`,
              },
            },
          });
  
          console.log("Created blok", x.data?.createBlok);
        }
      }
    };


  return (
    <PageLayout title={"Bloks"} pageActions={
      <Button onClick={() => createBloks()} variant={"outline"}>
        Import Orkestrator Bloks
      </Button>
    }>
      <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Panels
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Panels are UI elements that can be composed to dashboards, just
            browse them here and drag them to your dashboard.
          </p>
        </div>
      </div>
      <BlokList />
    </PageLayout>
  );
};

export default Page;
