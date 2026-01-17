import { Guard } from "@/app/Arkitekt";
import { useFlowQuery } from "@/reaktion/api/graphql";
import { EditFlow } from "@/reaktion/edit/EditFlow";
import { useParams } from "react-router-dom";

export const FlowDetail = (props: { id: string }) => {
  const { data, error } = useFlowQuery({
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
      <Guard.Fluss>
        <FlowDetail id={id} />
      </Guard.Fluss>
    </>
  );
}

export default Page;
