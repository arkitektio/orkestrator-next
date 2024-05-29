
import { SnapshotFragment } from "../../api/graphql";
import { useResolve } from "@/datalayer/hooks/useResolve";

const SnapshotPanel = ({ image }: { image: SnapshotFragment }) => {
  const s3resolve = useResolve();

  return (
    <>
      {image.store && (
        <img
          src={s3resolve(image.store.presignedUrl)}
          className="w-full h-full"
        />
      )}
    </>
  );
};

export default SnapshotPanel;
