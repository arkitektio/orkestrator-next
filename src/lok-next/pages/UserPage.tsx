import { DetailRouteProps, asDetailRoute } from "@/app/routes/DetailRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroDataset } from "@/linkers";
import { useUserQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

const Page = ({ id }: DetailRouteProps) => {
  const { data } = useUserQuery({
    variables: {
      id: id,
    },
  });

  return (
    <PageLayout
      actions={<MikroDataset.Actions id={id} />}
      title={data?.user?.username}
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle>{data?.user?.username}</DetailPaneTitle>
        </DetailPaneHeader>
      </DetailPane>
    </PageLayout>
  );
};

export default asDetailRoute(Page);
