import { useResolve } from "@/datalayer/hooks/useResolve";
import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroSnapshot } from "@/linkers";
import { useGetSnapshotQuery } from "@/mikro-next/api/graphql";

export const TDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetSnapshotQuery({
    variables: {
      id: props.object,
    },
  });

  const s3resolve = useResolve();

  return (
    <MikroSnapshot.DetailLink object={props.object}>
      <div className="w-[200px] h-[200px]">
        {data?.snapshot.store && (
          <img
            src={s3resolve(data?.snapshot.store.presignedUrl)}
            className="w-full h-full m-0"
          />
        )}
      </div>
    </MikroSnapshot.DetailLink>
  );
};

export default TDisplay;
