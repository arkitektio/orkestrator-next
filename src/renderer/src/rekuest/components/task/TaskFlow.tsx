import { useRunForTaskQuery } from "@/reaktion/api/graphql";
import { TrackFlow } from "@/reaktion/track/TrackFlow";
import { DetailTaskFragment } from "@/rekuest/api/graphql";
import { useEffect } from "react";

/**
 * Live flow view for tasks whose implementation is a reaktion `run_flow`.
 * Kept in its own module so pages that never render flows don't pull in the
 * reaktion dependency.
 */
export const TaskFlow = (props: {
  id: string;
  task: DetailTaskFragment;
}) => {
  const { data, error, refetch } = useRunForTaskQuery({
    variables: {
      id: props.task.id,
    },
  });

  useEffect(() => {
    if (!error) return;
    console.error(error);
    const t = setTimeout(refetch, 1000);
    return () => clearTimeout(t);
  }, [error, refetch]);

  return (
    <>
      {data?.runForTask && (
        <TrackFlow
          run={data.runForTask}
          task={props.task}
        />
      )}
      {error && <div>Error: {error.message}</div>}
    </>
  );
};
