import { useArkitekt } from "@/lib/arkitekt/provider";
import { useSettings } from "@/providers/settings/SettingsContext";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AgentState, OrkestratorAgent } from "./Agent";
import { resetAgentState, setAgentState, useAgentState } from "./store";

export type AgentContextType = AgentState & {
  agent: OrkestratorAgent | null;
  disabled: boolean;
};

type AgentProviderContextType = {
  agent: OrkestratorAgent | null;
  disabled: boolean;
};

export const AgentContext = createContext<AgentProviderContextType>({
  agent: null,
  disabled: false,
});

const useAgentContext = () => useContext(AgentContext);

export const useAgent = (): AgentContextType => {
  const { agent, disabled } = useAgentContext();
  const state = useAgentState((currentState) => currentState);

  return useMemo(
    () => ({
      ...state,
      agent,
      disabled,
    }),
    [agent, disabled, state],
  );
};

export const useAgentInstance = () => useAgentContext().agent;

export const AgentProvider: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
}> = ({
  children,
  disabled = false,
}) => {
  const arkitekt = useArkitekt();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const connection = arkitekt.connection;
  const agentRef = useRef<OrkestratorAgent | null>(null);
  const [agent, setAgent] = useState<OrkestratorAgent | null>(null);

  useEffect(() => {
    try {
      if (disabled || !connection || !settings.startAgent) {
        if (agentRef.current) {
          agentRef.current.disconnect();
          agentRef.current = null;
        }
        setAgent(null);
        resetAgentState();
        return;
      }

      const newAgent = new OrkestratorAgent(arkitekt, settings.instanceId, navigate);
      agentRef.current = newAgent;
      setAgent(newAgent);

      const unsubscribe = newAgent.subscribe((newState) => {
        setAgentState(newState);
      });

      newAgent.connect();

      console.log("AgentProvider: Agent started");

      return () => {
        unsubscribe();
        if (agentRef.current === newAgent) {
          agentRef.current = null;
          setAgent(null);
        }
        newAgent.disconnect();
        resetAgentState();
      };
    } catch (e) {
      resetAgentState();
      setAgent(null);
      agentRef.current = null;
      console.error("AgentProvider: Failed to start agent", e);
      return undefined;
    }
  }, [connection, disabled, navigate, settings.instanceId, settings.startAgent]);

  const contextValue = useMemo(
    () => ({
      agent,
      disabled,
    }),
    [agent, disabled],
  );

  return <AgentContext.Provider value={contextValue}>{children}</AgentContext.Provider>;
};
