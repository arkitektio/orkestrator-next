import { useFlowQuery } from "@/reaktion/api/graphql";
import { EditFlow } from "@/reaktion/edit/EditFlow";
import { FlussGuard, withFluss } from "@jhnnsrs/fluss";
import { useParams } from "react-router-dom";

export const FlowDetail = (props: { id: string }) => {
  const { data, error } = withFluss(useFlowQuery)({
    variables: {
      id: props.id,
    },
  });

  console.log(error?.message, data);

  return <>{data?.flow && <EditFlow flow={data.flow} />}</>;
};

function Page() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>Missing id</div>;
  }

  return (
    <>
      <FlussGuard>
        <FlowDetail id={id} />
      </FlussGuard>
    </>
  );
}

export default Page;
