import { UploadOptions } from "@/datalayer/hooks/useUpload";
import { useUpload } from "@/providers/upload/UploadProvider";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

export type UploadFunc = (
  file: File,
  options: UploadOptions,
) => Promise<string>;
export type CreateFunc = (file: File, key: string) => Promise<any>;

export const UploadZone: React.FC<{
  uploadFile: UploadFunc;
  createFile: CreateFunc;
}> = ({ uploadFile, createFile }) => {
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
    <div
      ref={drop}
      className={`w-full h-full flex items-center justify-center border-2 border-dashed rounded-lg transition-colors p-10 ${isOver && canDrop
        ? "border-primary bg-primary/10"
        : "border-muted-foreground/25 hover:border-primary/50"
        }`}
    >
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isOver && canDrop ? "Drop files here" : "Drag & drop files here"}
        </p>
      </div>
    </div>
  );
};
