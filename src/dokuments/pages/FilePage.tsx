import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { DokumentsDocument, DokumentsFile, LovekitStream } from "@/linkers";
import { useGetFileQuery } from "../api/graphql";

export default asDetailQueryRoute(
  useGetFileQuery,
  ({ data, subscribeToMore }) => {
    return (
      <DokumentsFile.ModelPage
        title={data?.file.id}
        object={data?.file.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <DokumentsFile.ObjectButton object={data.file.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <LovekitStream.Komments object={data.file.id} />,
            }}
          />
        }
      >
        {data.file.id}

        {data.file.documents.map((doc) => (
          <DokumentsDocument.DetailLink
            object={doc.id}
            key={doc.id}
            className="px-2 py-2 "
          >
            {doc.title}
          </DokumentsDocument.DetailLink>
            
        ))}
      </DokumentsFile.ModelPage>
    );
  },
);
