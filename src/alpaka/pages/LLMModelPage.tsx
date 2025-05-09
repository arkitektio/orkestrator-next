import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChatLayout } from "@/components/chat/chat-layout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AlpakaCollection, AlpakaLLMModel } from "@/linkers";
import {
  useGetChromaCollectionQuery,
  useGetLlmModelQuery,
} from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useGetLlmModelQuery,
  ({ data, subscribeToMore }) => {
    return (
      <AlpakaLLMModel.ModelPage
        title={data?.llmModel?.modelId}
        object={data.llmModel.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <AlpakaLLMModel.ObjectButton object={data.llmModel.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <AlpakaLLMModel.Komments object={data.llmModel.id} />,
            }}
          />
        }
      >
        {data.llmModel.id}

        {data.llmModel.features?.map((feature) => (
          <div key={feature} className="text-sm text-gray-500">
            {feature}
          </div>
        ))}

        {data.llmModel.embedderFor?.map((embedder) => (
          <AlpakaCollection.DetailLink
            key={embedder.id}
            object={embedder.id}
            className="text-blue-500"
          >
            {embedder.name}
          </AlpakaCollection.DetailLink>
        ))}
      </AlpakaLLMModel.ModelPage>
    );
  },
);
