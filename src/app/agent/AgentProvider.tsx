import { useArkitekt } from "@/lib/arkitekt/provider";
import { useSettings } from "@/providers/settings/SettingsContext";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgentState, OrkestratorAgent } from "./Agent";

export type AgentContextType = AgentState & {
  agent: OrkestratorAgent | null;
};

export const AgentContext = createContext<AgentContextType>({
  assignments: [],
  errors: [],
  connected: false,
  agent: null,
});

export const useAgent = () => useContext(AgentContext);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const arkitekt = useArkitekt();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [agent, setAgent] = useState<OrkestratorAgent | null>(null);
  const [state, setState] = useState<AgentState>({
    assignments: [],
    errors: [],
    connected: false,
    lastCode: undefined,
    lastReason: undefined,
  });

  useEffect(() => {
    if (!arkitekt.connection || !settings.startAgent) {
      if (agent) {
        agent.disconnect();
        setAgent(null);
      }
      return;
    }

    const newAgent = new OrkestratorAgent(
      arkitekt,
      settings.instanceId,
      navigate
    );
    newAgent.registerElectron();
    newAgent.connect();

    const unsubscribe = newAgent.subscribe((newState) => {
      setState(newState);
    });

    setAgent(newAgent);

    return () => {
      unsubscribe();
      newAgent.disconnect();
    };
  }, [arkitekt.connection, settings.startAgent, settings.instanceId]);

  return (
    <AgentContext.Provider value={{ ...state, agent }}>
      {children}
    </AgentContext.Provider>
  );
};
