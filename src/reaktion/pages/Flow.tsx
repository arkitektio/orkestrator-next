import { EditFlow } from "@/reaktion/edit/EditFlow";
import { useFlowQuery } from "@/rekuest/api/graphql";
import { RekuestGuard, withRekuest } from "@jhnnsrs/rekuest-next";
import { useParams } from "react-router-dom";

export const FlowDetail = (props: { id: string }) => {
  const { data, error } = withRekuest(useFlowQuery)({
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
      <RekuestGuard>
        <FlowDetail id={id} />
      </RekuestGuard>
    </>
  );
}

export default Page;
