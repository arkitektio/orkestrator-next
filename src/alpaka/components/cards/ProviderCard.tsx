import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlpakaProvider } from "@/linkers";
import Anthropic from "@lobehub/icons-static-svg/icons/anthropic.svg";
import Aws from "@lobehub/icons-static-svg/icons/aws.svg";
import Azure from "@lobehub/icons-static-svg/icons/azure.svg";
import Google from "@lobehub/icons-static-svg/icons/google.svg";
import HuggingFace from "@lobehub/icons-static-svg/icons/huggingface.svg";
import Mistral from "@lobehub/icons-static-svg/icons/mistral.svg";
import Ollama from "@lobehub/icons-static-svg/icons/ollama.svg";
import OpenAI from "@lobehub/icons-static-svg/icons/openai.svg";
import Perplexity from "@lobehub/icons-static-svg/icons/perplexity.svg";
import { Bot, Cloud, Cpu, Server } from "lucide-react";
import { MateFinder } from "../../../mates/types";
import { ListProviderFragment, ProviderKind } from "../../api/graphql";

interface Props {
  item: ListProviderFragment;
  mates?: MateFinder[];
}

export const kindToIcon: Record<ProviderKind, React.ReactNode> = {
  [ProviderKind.Anthropic]: (
    <img
      src={Anthropic}
      alt="Anthropic"
      className="w-16 h-16 brightness-0 invert"
    />
  ),
  [ProviderKind.Anyscale]: <Server className="w-16 h-16 text-white" />,
  [ProviderKind.Aws]: (
    <img src={Aws} alt="AWS" className="w-16 h-16 brightness-0 invert" />
  ),
  [ProviderKind.Azure]: (
    <img src={Azure} alt="Azure" className="w-16 h-16 brightness-0 invert" />
  ),
  [ProviderKind.Cohere]: <Bot className="w-16 h-16 text-white" />,
  [ProviderKind.Custom]: <Cpu className="w-16 h-16 text-white" />,
  [ProviderKind.Deepinfra]: <Cloud className="w-16 h-16 text-white" />,
  [ProviderKind.FireworksAi]: <Bot className="w-16 h-16 text-white" />,
  [ProviderKind.Google]: (
    <img src={Google} alt="Google" className="w-16 h-16 brightness-0 invert" />
  ),
  [ProviderKind.Groq]: <Cpu className="w-16 h-16 text-white" />,
  [ProviderKind.Huggingface]: (
    <img
      src={HuggingFace}
      alt="Hugging Face"
      className="w-16 h-16 brightness-0 invert"
    />
  ),
  [ProviderKind.Mistral]: (
    <img
      src={Mistral}
      alt="Mistral"
      className="w-16 h-16 brightness-0 invert"
    />
  ),
  [ProviderKind.Ollama]: (
    <img src={Ollama} alt="Ollama" className="w-16 h-16 brightness-0 invert" />
  ),
  [ProviderKind.Openai]: (
    <img src={OpenAI} alt="OpenAI" className="w-16 h-16 brightness-0 invert" />
  ),
  [ProviderKind.Palm]: (
    <img src={Google} alt="PaLM" className="w-16 h-16 brightness-0 invert" />
  ),
  [ProviderKind.Perplexity]: (
    <img
      src={Perplexity}
      alt="Perplexity"
      className="w-16 h-16 brightness-0 invert"
    />
  ),
  [ProviderKind.Replicate]: <Bot className="w-16 h-16 text-white" />,
  [ProviderKind.TogetherAi]: <Cloud className="w-16 h-16 text-white" />,
  [ProviderKind.Unknown]: <Bot className="w-16 h-16 text-white" />,
  [ProviderKind.VertexAi]: (
    <img
      src={Google}
      alt="Vertex AI"
      className="w-16 h-16 brightness-0 invert"
    />
  ),
};

const getProviderGradient = (kind: ProviderKind): string => {
  switch (kind) {
    case ProviderKind.Anthropic:
      return "bg-gradient-to-br from-orange-500 to-red-600";
    case ProviderKind.Anyscale:
      return "bg-gradient-to-br from-purple-600 to-purple-800";
    case ProviderKind.Aws:
      return "bg-gradient-to-br from-orange-400 to-orange-600";
    case ProviderKind.Azure:
      return "bg-gradient-to-br from-blue-500 to-blue-700";
    case ProviderKind.Cohere:
      return "bg-gradient-to-br from-blue-500 to-blue-700";
    case ProviderKind.Custom:
      return "bg-gradient-to-br from-gray-500 to-gray-700";
    case ProviderKind.Deepinfra:
      return "bg-gradient-to-br from-indigo-500 to-indigo-700";
    case ProviderKind.FireworksAi:
      return "bg-gradient-to-br from-orange-500 to-red-600";
    case ProviderKind.Google:
      return "bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500";
    case ProviderKind.Groq:
      return "bg-gradient-to-br from-green-500 to-green-700";
    case ProviderKind.Huggingface:
      return "bg-gradient-to-br from-yellow-400 to-orange-500";
    case ProviderKind.Mistral:
      return "bg-gradient-to-br from-red-500 to-red-700";
    case ProviderKind.Ollama:
      return "bg-gradient-to-br from-slate-600 to-slate-800";
    case ProviderKind.Openai:
      return "bg-gradient-to-br from-green-400 to-blue-500";
    case ProviderKind.Palm:
      return "bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500";
    case ProviderKind.Perplexity:
      return "bg-gradient-to-br from-purple-500 to-pink-600";
    case ProviderKind.Replicate:
      return "bg-gradient-to-br from-yellow-400 to-orange-500";
    case ProviderKind.TogetherAi:
      return "bg-gradient-to-br from-teal-500 to-cyan-600";
    case ProviderKind.Unknown:
      return "bg-gradient-to-br from-gray-400 to-gray-600";
    case ProviderKind.VertexAi:
      return "bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500";
    default:
      return "bg-gradient-to-br from-gray-500 to-gray-700";
  }
};

const getProviderKindDisplayName = (kind: ProviderKind): string => {
  switch (kind) {
    case ProviderKind.Anthropic:
      return "Anthropic";
    case ProviderKind.Anyscale:
      return "Anyscale";
    case ProviderKind.Aws:
      return "AWS";
    case ProviderKind.Azure:
      return "Azure";
    case ProviderKind.Cohere:
      return "Cohere";
    case ProviderKind.Custom:
      return "Custom";
    case ProviderKind.Deepinfra:
      return "DeepInfra";
    case ProviderKind.FireworksAi:
      return "Fireworks AI";
    case ProviderKind.Google:
      return "Google";
    case ProviderKind.Groq:
      return "Groq";
    case ProviderKind.Huggingface:
      return "Hugging Face";
    case ProviderKind.Mistral:
      return "Mistral";
    case ProviderKind.Ollama:
      return "Ollama";
    case ProviderKind.Openai:
      return "OpenAI";
    case ProviderKind.Palm:
      return "PaLM";
    case ProviderKind.Perplexity:
      return "Perplexity";
    case ProviderKind.Replicate:
      return "Replicate";
    case ProviderKind.TogetherAi:
      return "Together AI";
    case ProviderKind.Unknown:
      return "Unknown";
    case ProviderKind.VertexAi:
      return "Vertex AI";
    default:
      return kind;
  }
};

const TheCard = ({ item, mates }: Props) => {
  return (
    <AlpakaProvider.Smart object={item?.id} mates={mates}>
      <Card className="w-full h-48 relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 group">
        <div
          className={`absolute inset-0 ${getProviderGradient(item.kind)} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon section - takes most of the space */}
          <div className="flex-1 flex items-center justify-center pt-6">
            <div className="flex-shrink-0 drop-shadow-lg">
              {kindToIcon[item.kind]}
            </div>
          </div>

          {/* Bottom section with name and badge */}
          <div className="p-4 bg-black/20 backdrop-blur-sm">
            <AlpakaProvider.DetailLink
              object={item.id}
              className="text-xl font-bold text-white hover:text-white/90 transition-colors truncate block mb-2 text-center"
            >
              {item.name}
            </AlpakaProvider.DetailLink>

            <div className="flex items-center justify-center">
              <Badge
                variant="outline"
                className="text-xs bg-white/20 border-white/30 text-white hover:bg-white/30 transition-colors"
              >
                {getProviderKindDisplayName(item.kind)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      </Card>
    </AlpakaProvider.Smart>
  );
};

export default TheCard;
