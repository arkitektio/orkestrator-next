import { useGetProtocolEventCategoryQuery } from "../api/graphql";
import CreateProtocolEventForm from "./CreateProtocolEventForm";

export default (props: { id: string; rolemap: { [key: string]: any } }) => {
  const { data, error, loading } = useGetProtocolEventCategoryQuery({
    variables: {
      id: props.id,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CreateProtocolEventForm
      protocolEventCategory={data.protocolEventCategory}
      rolemap={props.rolemap}
    />
  );
};
