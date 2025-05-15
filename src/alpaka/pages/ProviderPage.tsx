import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChatLayout } from "@/components/chat/chat-layout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AlpakaCollection, AlpakaLLMModel, AlpakaProvider } from "@/linkers";
import {
  useGetChromaCollectionQuery,
  useGetLlmModelQuery,
  useGetProviderQuery,
} from "../api/graphql";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useGetProviderQuery,
  ({ data, subscribeToMore }) => {
    return (
      <AlpakaProvider.ModelPage
        title={data?.provider?.name}
        object={data.provider.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <AlpakaProvider.ObjectButton object={data.provider.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <AlpakaProvider.Komments object={data.provider.id} />,
            }}
          />
        }
      >
        {data.provider.id}
      </AlpakaProvider.ModelPage>
    );
  },
);
