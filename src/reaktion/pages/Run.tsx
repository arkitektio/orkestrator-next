import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useFlowQuery, useGetRunQuery } from "@/reaktion/api/graphql";
import { EditFlow } from "@/reaktion/edit/EditFlow";
import { withFluss } from "@jhnnsrs/fluss";
import { TrackFlow } from "../track/TrackFlow";

export const FlowDetail = (props: { id: string }) => {
  const { data, error } = withFluss(useFlowQuery)({
    variables: {
      id: props.id,
    },
  });

  console.log(error?.message, data);

  return <>{data?.flow && <EditFlow flow={data.flow} />}</>;
};

export default asDetailQueryRoute(
  withFluss(useGetRunQuery),
  ({ data, refetch }) => {

  return (
    <>
      <TrackFlow assignation={{id: data.run.assignation}} />
    </>
  );
});

