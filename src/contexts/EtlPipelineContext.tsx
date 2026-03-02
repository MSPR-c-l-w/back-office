"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type EtlPipelineContextValue = {
  isPipelineRunning: boolean;
  setPipelineRunning: (running: boolean) => void;
};

const EtlPipelineContext = createContext<EtlPipelineContextValue | null>(null);

export function EtlPipelineProvider({ children }: { children: ReactNode }) {
  const [isPipelineRunning, setPipelineRunning] = useState(false);
  const setRunning = useCallback((running: boolean) => {
    setPipelineRunning(running);
  }, []);
  return (
    <EtlPipelineContext.Provider
      value={{ isPipelineRunning, setPipelineRunning: setRunning }}
    >
      {children}
    </EtlPipelineContext.Provider>
  );
}

export function useEtlPipelineRunning() {
  const ctx = useContext(EtlPipelineContext);
  if (!ctx) {
    throw new Error("useEtlPipelineRunning must be used within EtlPipelineProvider");
  }
  return ctx;
}
