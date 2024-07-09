import { PageLayout } from "@/components/layout/PageLayout";
import NodeList from "@/rekuest/components/lists/NodeList";
const Page = () => {
  return (
    <PageLayout title={"Nodes"}>
      <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Your Nodes
                  </h1>
                  <p className="mt-3 text-xl text-muted-foreground">
                    Nodes are actions that can be executed by the system. When assigning
                    to a node,  implementations are dynamically assigned :)
                  </p>
                </div>
              </div>
      <NodeList />
    </PageLayout>
  );
};

export default Page;
