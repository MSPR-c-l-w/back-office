"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export type PipelineId = "nutrition" | "exercise" | "health-profile";

export type EtlLogEntry = {
  timestamp: string;
  level: string;
  message: string;
};

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

export function useEtlLogs() {
  const [logsByPipeline, setLogsByPipeline] = useState<
    Record<PipelineId, EtlLogEntry[]>
  >({
    nutrition: [],
    exercise: [],
    "health-profile": [],
  });
  const [activePipeline, setActivePipeline] = useState<PipelineId>("nutrition");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const subscribedPipelineRef = useRef<PipelineId | null>(null);

  const socketUrl =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_API_URL ?? "")
      : "";

  const subscribe = useCallback(
    (pipelineId: PipelineId) => {
      if (!socketUrl) return;

      if (!socketRef.current) {
        const socket = io(socketUrl, {
          path: "/socket.io",
          transports: ["websocket", "polling"],
          autoConnect: true,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          setIsConnected(true);
        });
        socket.on("disconnect", () => {
          setIsConnected(false);
        });
        socket.on(
          "etl:log",
          (payload: {
            pipelineId?: PipelineId;
            timestamp: string;
            level: string;
            message: string;
          }) => {
            const pipelineId = payload.pipelineId;
            if (
              pipelineId !== "nutrition" &&
              pipelineId !== "exercise" &&
              pipelineId !== "health-profile"
            ) {
              return;
            }
            setLogsByPipeline((prev) => ({
              ...prev,
              [pipelineId]: [
                ...prev[pipelineId],
                {
                  timestamp: formatTimestamp(payload.timestamp),
                  level: payload.level ?? "INFO",
                  message: payload.message ?? "",
                },
              ],
            }));
          }
        );
      }

      const socket = socketRef.current;
      setActivePipeline(pipelineId);
      if (subscribedPipelineRef.current !== pipelineId) {
        if (subscribedPipelineRef.current) {
          socket.emit("unsubscribe", {
            pipeline: subscribedPipelineRef.current,
          });
        }
        subscribedPipelineRef.current = pipelineId;
        socket.emit("subscribe", { pipeline: pipelineId });
      }
    },
    [socketUrl]
  );

  const clearLogs = useCallback(
    (pipelineId?: PipelineId) => {
      const target = pipelineId ?? activePipeline;
      setLogsByPipeline((prev) => ({
        ...prev,
        [target]: [],
      }));
    },
    [activePipeline]
  );

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        subscribedPipelineRef.current = null;
      }
    };
  }, []);

  return {
    logs: logsByPipeline[activePipeline] ?? [],
    clearLogs,
    subscribe,
    isConnected,
    activePipeline,
  };
}
