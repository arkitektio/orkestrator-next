import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { AlpakaCollection, AlpakaLLMModel } from "@/linkers";
import {
  useGetLlmModelQuery
} from "../api/graphql";
import { useDialog } from "@/app/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export type IRepresentationScreenProps = {};

export default asDetailQueryRoute(
  useGetLlmModelQuery,
  ({ data, subscribeToMore }) => {
    const { openDialog } = useDialog();

    return (
      <AlpakaLLMModel.ModelPage
        title={data?.llmModel?.modelId}
        object={data.llmModel.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => openDialog("chat", { model: data.llmModel.id })}
              variant="outline"
              size="sm"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
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
        {data.llmModel.modelId}

        <div className="text-lg font-light text-muted-foreground mb-2">
          {data.llmModel.provider?.name}
        </div>
        <div className="text-md font-light text-muted-foreground mb-4">
          {data.llmModel.provider.kind}
        </div>

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
