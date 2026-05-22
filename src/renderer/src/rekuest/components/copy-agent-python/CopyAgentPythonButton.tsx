import { Button } from "@/components/ui/button";
import {
  AgentFragment,
  useAgentForProtocolLazyQuery,
} from "@/rekuest/api/graphql";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { protocolAgentToPythonString } from "./protocolAgentToPythonString";

export const CopyAgentPythonButton = (props: { agent: AgentFragment }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchProtocol] = useAgentForProtocolLazyQuery();

  const handleCopy = async () => {
    setLoading(true);
    try {
      const result = await fetchProtocol({ variables: { id: props.agent.id } });
      if (result.data?.agent) {
        await navigator.clipboard.writeText(
          protocolAgentToPythonString(result.data.agent),
        );
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <ClipboardCheck className="mr-2 h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Clipboard className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Copy Python"}
        </>
      )}
    </Button>
  );
};
