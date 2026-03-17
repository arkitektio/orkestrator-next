import { UploadOptions } from "@/datalayer/hooks/useUpload";
import { useUpload } from "@/providers/upload/UploadProvider";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

export type ElectronFile = File & { path: string };

export type UploadFunc = (
  file: ElectronFile,
  options: UploadOptions,
) => Promise<string>;
export type CreateFunc = (file: ElectronFile, key: string) => Promise<any>;

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
        // In react-dnd, the HTML5 backend item may strip properties like path from File objects on Linux/Windows.
        // Try getting the original Electron File object with .path from dataTransfer first.
        const dataTransfer = (item as any).dataTransfer;
        const files: ElectronFile[] = dataTransfer?.files
          ? Array.from(dataTransfer.files)
          : (item as any).files;

        console.log("Dropped items:", item, "Extracted files:", files);
        if (files) {
          files.forEach((file) => {
            startUpload(
              file,
              async (file, { id, onProgress, signal }) => {
                return await uploadFile(file as ElectronFile, { id, onProgress, signal });
              },
              async (file, key) => {
                return await createFile(file as ElectronFile, key);
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
