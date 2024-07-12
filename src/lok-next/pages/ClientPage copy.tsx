import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  DetailPane,
  DetailPaneContent,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { MikroDataset } from "@/linkers";
import { useDetailClientQuery } from "../api/graphql";
import ServiceInstanceMappingCard from "../components/cards/ServiceInstanceMappingCard";

export default asDetailQueryRoute(useDetailClientQuery, ({ data }) => {
  return (
    <PageLayout
      actions={<MikroDataset.Actions id={data?.client?.id} />}
      title={data?.client?.release.app.identifier}
    >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle>{data?.client?.composition.name}</DetailPaneTitle>
          nana
        </DetailPaneHeader>
        <DetailPaneContent>
          <ListRender array={data?.client?.composition?.mappings}>
            {(item) => <ServiceInstanceMappingCard item={item} />}
          </ListRender>
        </DetailPaneContent>
      </DetailPane>
    </PageLayout>
  );
});
