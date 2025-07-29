import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { DokumentsDocument, DokumentsFile, DokumentsPage, LovekitStream } from "@/linkers";
import { useGetDocumentQuery, useGetFileQuery } from "../api/graphql";

export default asDetailQueryRoute(
  useGetDocumentQuery,
  ({ data, subscribeToMore }) => {
    return (
      <DokumentsDocument.ModelPage
        title={data?.document.id}
        object={data?.document.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <DokumentsDocument.ObjectButton object={data.document.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <LovekitStream.Komments object={data.document.id} />,
            }}
          />
        }
      >
        {data.document.id}

        {data.document.pages.map((doc) => (
          <DokumentsPage.DetailLink
            object={doc.id}
            key={doc.id}
            className="px-2 py-2 "
          >
            {doc.index}
          </DokumentsPage.DetailLink>
            
        ))}
      </DokumentsDocument.ModelPage>
    );
  },
);
