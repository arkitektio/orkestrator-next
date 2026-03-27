import { useDialog } from "@/app/dialog";
import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Button } from "@/components/ui/button";
import { AlpakaCollection, AlpakaLLMModel } from "@/linkers";
import { MessageSquare } from "lucide-react";
import {
  useGetLlmModelQuery
} from "../api/graphql";

export type IRepresentationScreenProps = {};

export const TPage =  asDetailQueryRoute(
  useGetLlmModelQuery,
  ({ data, subscribeToMore }) => {
    const { openDialog } = useDialog();

    return (
      <AlpakaLLMModel.ModelPage
        title={data?.llmModel.llmString}
        object={data.llmModel}
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
            <Button
              onClick={() => openDialog("usemodelfor", { model: data.llmModel.id })}
              variant="outline"
              size="sm"
            >
              Use For...
            </Button>
            <AlpakaLLMModel.ObjectButton object={data.llmModel} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <AlpakaLLMModel.Komments object={data.llmModel} />,
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

        {data.llmModel.inputModalities && (
          <div className="mt-4">
            <strong>Input Modalities:</strong> {data.llmModel.inputModalities.join(", ")}
          </div>
        )}

        {data.llmModel.outputModalities && (
          <div className="mt-2">
            <strong>Output Modalities:</strong> {data.llmModel.outputModalities.join(", ")}
          </div>
        )}

        {data.llmModel.embedderFor?.map((embedder) => (
          <AlpakaCollection.DetailLink
            key={embedder.id}
            object={embedder}
            className="text-blue-500"
          >
            {embedder.name}
          </AlpakaCollection.DetailLink>
        ))}
      </AlpakaLLMModel.ModelPage>
    );
  },
);


export default TPage
