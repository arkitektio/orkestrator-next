import { useGetProtocolEventCategoryQuery } from "../api/graphql";
import CreateProtocolEventForm from "./CreateProtocolEventForm";

const TForm =  (props: { id: string; rolemap: { [key: string]: any } }) => {
  const { data, error, loading } = useGetProtocolEventCategoryQuery({
    variables: {
      id: props.id,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !data.protocolEventCategory) {
    return <div>No protocol event category found.</div>;
  }

  return (
    <CreateProtocolEventForm
      protocolEventCategory={data.protocolEventCategory}
      rolemap={props.rolemap}
    />
  );
};

export default TForm;
