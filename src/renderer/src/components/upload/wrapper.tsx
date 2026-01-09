import { UploadOptions } from "@/datalayer/hooks/useUpload";
import { useUpload } from "@/providers/upload/UploadProvider";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

export type UploadFunc = (
  file: File,
  options: UploadOptions,
) => Promise<string>;
export type CreateFunc = (file: File, key: string) => Promise<any>;

export const UploadWrapper = ({ uploadFile, createFile, children }: {
  uploadFile: UploadFunc;
  createFile: CreateFunc;
  children: React.ReactNode;
}) => {
  const { startUpload } = useUpload();

  const [{ isOver, canDrop }, drop] = useDrop(() => {
    return {
      accept: [NativeTypes.FILE],
      drop: (item, monitor) => {
        const files: File[] = (item as any).files;
        if (files) {
          files.forEach((file) => {
            startUpload(
              file,
              async (file, { onProgress, signal }) => {
                return await uploadFile(file, { onProgress, signal });
              },
              async (file, key) => {
                return await createFile(file, key);
              }
            ).catch(console.error);
          });
        }
        return {};
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    };
  }, [uploadFile, createFile, startUpload]);

  return (
    <div className="w-full h-full relative" ref={drop}>
      {isOver && canDrop && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary rounded-lg pointer-events-none">
          <p className="text-2xl font-semibold text-primary">Drop files to upload</p>
        </div>
      )}
      {children}
    </div>
  );
};
