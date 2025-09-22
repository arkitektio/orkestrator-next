import { UploadOptions } from "@/datalayer/hooks/useUpload";
import { useState } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

export type UploadFunc = (
  file: File,
  options: UploadOptions,
) => Promise<string>;
export type CreateFunc = (file: File, key: string) => Promise<any>;
export type UploadFuture = {
  hash: string;
  file: File;
  controller: AbortController;
  future: Promise<any>;
  progress?: number;
};

const hashFile = (file: File) => {
  return `${file.name}_${file.size}_${file.type}`;
};

export const UploadZone: React.FC<{
  uploadFile: UploadFunc;
  createFile: CreateFunc;
}> = ({ uploadFile, createFile }) => {
  const [uploadFutures, setUploadFutures] = useState<UploadFuture[]>([]);

  const [{ isOver, canDrop }, drop] = useDrop(() => {
    return {
      accept: [NativeTypes.FILE],
      drop: (item, monitor) => {
        const files: File[] = (item as any).files;
        console.log("files", files);
        const futures: UploadFuture[] = files.map((file: any, index) => {
          let abortController = new AbortController();

          let hash = hashFile(file);

          return {
            hash: hash,
            file: file,
            controller: abortController,
            future: uploadFile(file, {
              signal: abortController.signal,
              onProgress: (ev: ProgressEvent) => {
                console.log("Progress", ev);
                if (ev.lengthComputable) {
                  setUploadFutures((prev) =>
                    prev.map((f) =>
                      f.hash === hash
                        ? { ...f, progress: ev.loaded / ev.total }
                        : f,
                    ),
                  );
                }
              },
            })
              .then((key) => {
                console.log("Upload done");
                return createFile(file, key);
              })
              .then((x) => {
                console.log("Create done");
                setUploadFutures((futures) =>
                  futures.filter((f) => f.hash !== hashFile(file)),
                );
              })
              .catch((e) => {
                console.log("error", e);
                setUploadFutures((futures) =>
                  futures.filter((f) => f.hash !== hashFile(file)),
                );
              }),
          };
        });

        setUploadFutures(futures);
        return {};
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    };
  }, []);

  return (
    <>
      {uploadFutures.map((future, index) => (
        <div
          key={index}
          className="border border-gray-800 cursor-pointer rounded  text-white bg-gray-900 hover:shadow-lg group relative"
          style={{
            background: `center bottom linear-gradient(to right, rgba(0,220,0,0.75) ${future.progress && Math.floor(future.progress * 100)
              }%, rgba(0,0,0,0.95) ${future.progress && Math.floor(future.progress * 100)
              }% ${future.progress && Math.floor((1 - future.progress) * 100)}%)`,
          }}
        >
          <div className="truncate p-5">
            <div className="flex-grow cursor-pointer font-semibold">
              {future.file.name}
            </div>
          </div>
          <button
            type="button"
            className="hidden group-hover:block text-white-500 bg-red-500 rounded-md text px-2 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 b"
            onClick={() => future.controller.abort()}
          >
            x
          </button>
        </div>
      ))}
      <div
        className={`${!canDrop && "hidden"
          } bg-slate-300 border border-gray-800 cursor-pointer rounded text-white  hover:shadow-lg`}
        ref={drop}
      >
        <div className="truncate p-5">
          {isOver ? "Release to upload" : "Drag and drop a file here"}
        </div>
      </div>
    </>
  );
};
