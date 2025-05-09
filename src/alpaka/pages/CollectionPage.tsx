import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChatLayout } from "@/components/chat/chat-layout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AlpakaCollection } from "@/linkers";
import {
  ChromaCollectionFragment,
  useGetChromaCollectionQuery,
  useQueryDocumentsLazyQuery,
} from "../api/graphql";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { StringField } from "@/components/fields/StringField";
import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { PortKind } from "@/rekuest/api/graphql";

export type IRepresentationScreenProps = {};

export const DocumentsExplorer = (props: {
  collection: ChromaCollectionFragment;
}) => {
  const [search, data] = useQueryDocumentsLazyQuery();

  const form = useForm({
    defaultValues: {
      query: "",
    },
  });

  const { watch } = form;

  const query = watch("query");

  const handleSearch = async () => {
    const { data } = await search({
      variables: {
        queryTexts: [query],
        collection: props.collection.id,
      },
    });
    console.log(data);
  };

  let debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch();
    }
  }, [debouncedQuery]);

  return (
    <>
      <Form {...form}>
        <form>
          <StringField
            placeholder="Search"
            name="query"
            className="w-full"
            label="Search"
          />
        </form>

        <div className="flex flex-col gap-2">
          {data?.data?.documents?.map((doc) => (
            <div key={doc.id} className="border border-gray-300 p-2 rounded">
              {doc.structure ? (
                <DelegatingStructureWidget
                  port={{
                    __typename: "Port",
                    key: "object",
                    nullable: true,
                    kind: PortKind.Structure,
                    identifier: doc.structure.identifier,
                  }}
                  value={doc.structure.object}
                />
              ) : (
                <>{doc.content}</>
              )}
            </div>
          ))}
        </div>
      </Form>
    </>
  );
};

export default asDetailQueryRoute(
  useGetChromaCollectionQuery,
  ({ data, subscribeToMore }) => {
    return (
      <AlpakaCollection.ModelPage
        title={data?.chromaCollection?.name}
        object={data.chromaCollection.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <AlpakaCollection.ObjectButton object={data.chromaCollection.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <AlpakaCollection.Komments object={data.chromaCollection.id} />
              ),
            }}
          />
        }
      >
        {data.chromaCollection.id}
        <DocumentsExplorer collection={data.chromaCollection} />
      </AlpakaCollection.ModelPage>
    );
  },
);
