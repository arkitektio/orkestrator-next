import { PageLayout } from "@/components/layout/PageLayout";
import NodeList from "@/rekuest/components/lists/NodeList";
import ReservationList from "@/rekuest/components/lists/ReservationList";

const Page = () => {
  return (
    <PageLayout title={"Dashboard"}>
      <NodeList />
      <ReservationList />
    </PageLayout>
  );
};

export default Page;
