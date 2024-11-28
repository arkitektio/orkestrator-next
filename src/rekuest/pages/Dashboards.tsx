import { PageLayout } from "@/components/layout/PageLayout";
import DashboardList from "../components/lists/DashboardList";

const Page = () => {
  const [createDashboard] = useCreate;

  return (
    <PageLayout title={"Dashboards"}>
      <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your dashboards
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Reservations are a way to predefine a task so that it can be
            executed later.
          </p>
        </div>
      </div>
      <DashboardList />
    </PageLayout>
  );
};

export default Page;
