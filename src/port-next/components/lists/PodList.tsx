import { ListRender } from "@/components/layout/ListRender";
import { PortPod } from "@/linkers";
import { useListPodQuery } from "@/port-next/api/graphql";
import { withPort } from "@jhnnsrs/port-next";
import PodCard from "../cards/PodCard";



const List = () => {
  const { data, error, subscribeToMore, refetch } = withPort(
    useListPodQuery,
  )({
    variables: {  },
  });

  return (
    <>
    {error && <div>Error: {error.message}</div>}
    <ListRender
      array={data?.pods}
      title={
        <PortPod.ListLink className="flex-0">
          Pods
        </PortPod.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <PodCard key={index} pod={ex} mates={[]} />}
    </ListRender>
    </>
  );
};

export default List;
