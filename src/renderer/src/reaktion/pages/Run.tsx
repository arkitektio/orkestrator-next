import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FlussRun } from "@/linkers";
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

export const Page = asDetailQueryRoute(useGetRunQuery, ({ data, refetch }) => {
  return (
    <FlussRun.ModelPage
      object={data.run}
      title={"Run for " + data.run.flow.title}
    >
      <TrackFlow run={data.run} />
    </FlussRun.ModelPage>
  );
});


export default Page;
