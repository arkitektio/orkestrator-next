import { PageLayout } from "@/components/layout/PageLayout";
import ActionList from "@/rekuest/components/lists/ActionList";
const Page = () => {
  return (
    <PageLayout title={"Actions"}>
      <div className="p-6">
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center mb-3">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Your Actions
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Actions are actions that can be executed by the system. When
              assigning to a action, implementations are dynamically assigned :)
            </p>
          </div>
        </div>

        <ActionList />
      </div>
    </PageLayout>
  );
};

export default Page;
