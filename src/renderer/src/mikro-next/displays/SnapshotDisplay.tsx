import { useResolve } from "@/datalayer/hooks/useResolve";
import { WithMikroMediaUrl } from "@/lib/datalayer/mikroAccess";
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
    <MikroSnapshot.DetailLink object={{ id: props.object }}>
      <div className="w-[200px] h-[200px]">
        <WithMikroMediaUrl media={data?.snapshot.store}>
          {(url) => (
            <img
              src={url}
              className="w-full h-full m-0"
            />
          )}
        </WithMikroMediaUrl>
      </div>
    </MikroSnapshot.DetailLink>
  );
};

export default TDisplay;
