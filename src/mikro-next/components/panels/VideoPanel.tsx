import { useResolve } from "@/datalayer/hooks/useResolve";
import ReactPlayer from "react-player";
import { VideoFragment } from "../../api/graphql";

const VideoPanel = ({ video }: { video: VideoFragment }) => {
  const s3resolve = useResolve();

  return (
    <>
      {video?.store && (
        <ReactPlayer
          url={s3resolve(video.store.presignedUrl)}
          onError={(e) => {
            console.log(e);
          }}
          controls
        />
      )}
    </>
  );
};

export default VideoPanel;
