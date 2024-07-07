import { PageLayout } from "@/components/layout/PageLayout";
import ReservationList from "@/rekuest/components/lists/ReservationList";

const Page = () => {
  return (
    <PageLayout title={"Reservations"}>
      <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
                <div>
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Your reservations
                  </h1>
                  <p className="mt-3 text-xl text-muted-foreground">
                    Reservations are a way to predefine a task so that it can be executed later.
                  </p>
                </div>
              </div>
      <ReservationList />
    </PageLayout>
  );
};

export default Page;
