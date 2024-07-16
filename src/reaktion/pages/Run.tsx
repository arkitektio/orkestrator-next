import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import { useFlowQuery, useGetRunQuery } from "@/reaktion/api/graphql";
import { EditFlow } from "@/reaktion/edit/EditFlow";
import { TrackFlow } from "../track/TrackFlow";

export const FlowDetail = (props: { id: string }) => {
  const { data, error } = useFlowQuery({
    variables: {
      id: props.id,
    },
  });

  console.log(error?.message, data);

  return <>{data?.flow && <EditFlow flow={data.flow} />}</>;
};

export default asDetailQueryRoute(useGetRunQuery, ({ data, refetch }) => {
  return (
    <PageLayout title={"Run for " + data.run.flow.title}>
      <TrackFlow run={data.run} />
    </PageLayout>
  );
});
