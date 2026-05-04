import { DisplayWidgetProps } from "@/lib/display/registry";
import { MikroFile } from "@/linkers";
import { useGetFileQuery } from "@/mikro-next/api/graphql";

export const FileDisplay = (props: DisplayWidgetProps) => {
  const { data } = useGetFileQuery({
    variables: {
      id: props.object,
    },
  });

  if (!data?.file) {
    return <div>File not found</div>;
  }


  return (
    <MikroFile.DetailLink object={data?.file}>
      <div className="w-full h-full">
        {data.file.name}
      </div>
    </MikroFile.DetailLink>
  );
};
