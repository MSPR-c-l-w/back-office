"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "@/utils/tokenStorage";

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
  const socketTokenRef = useRef<string | null>(null);
  const lastRequestedPipelineRef = useRef<PipelineId | null>(null);
  const pendingRetryTimerRef = useRef<number | null>(null);
  const connectAndSubscribeRef = useRef<
    ((pipelineId: PipelineId) => void) | null
  >(null);

  const socketUrl =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_API_URL ?? "")
      : "";

  const connectAndSubscribe = useCallback(
    (pipelineId: PipelineId) => {
      if (!socketUrl) return;
      const accessToken = getAccessToken();

      // WS ETL est sécurisé côté backend: sans token, on ne tente pas la connexion.
      if (!accessToken) {
        lastRequestedPipelineRef.current = pipelineId;
        setIsConnected(false);

        // Cas fréquent: le token n'est pas encore dispo au 1er rendu (chargement auth).
        // On retente quelques fois automatiquement pour éviter d'attendre une action user.
        if (pendingRetryTimerRef.current == null) {
          pendingRetryTimerRef.current = window.setInterval(() => {
            const token = getAccessToken();
            const requested = lastRequestedPipelineRef.current;
            if (!token || !requested) return;
            window.clearInterval(pendingRetryTimerRef.current ?? undefined);
            pendingRetryTimerRef.current = null;
            connectAndSubscribeRef.current?.(requested);
          }, 500);
        }
        return;
      }

      lastRequestedPipelineRef.current = pipelineId;

      if (!socketRef.current) {
        const socket = io(socketUrl, {
          path: "/socket.io",
          // En dev/proxy, démarrer en polling puis upgrade évite certains échecs WS initiaux.
          transports: ["polling", "websocket"],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 500,
          reconnectionDelayMax: 2000,
          auth: {
            token: `Bearer ${accessToken}`,
          },
        });
        socketRef.current = socket;
        socketTokenRef.current = accessToken;

        socket.on("connect", () => {
          setIsConnected(true);
          const requested = lastRequestedPipelineRef.current;
          if (requested) {
            socket.emit("subscribe", { pipeline: requested });
            subscribedPipelineRef.current = requested;
          }
        });
        socket.on("disconnect", () => {
          setIsConnected(false);
        });
        socket.on("connect_error", () => {
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
      if (socketTokenRef.current !== accessToken) {
        socket.auth = {
          token: `Bearer ${accessToken}`,
        };
        socketTokenRef.current = accessToken;
      }
      if (!socket.connected) {
        socket.connect();
      }
      setActivePipeline(pipelineId);
      if (socket.connected && subscribedPipelineRef.current !== pipelineId) {
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

  useEffect(() => {
    connectAndSubscribeRef.current = connectAndSubscribe;
  }, [connectAndSubscribe]);

  const subscribe = useCallback(
    (pipelineId: PipelineId) => {
      connectAndSubscribe(pipelineId);
    },
    [connectAndSubscribe]
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
      if (pendingRetryTimerRef.current != null) {
        window.clearInterval(pendingRetryTimerRef.current ?? undefined);
        pendingRetryTimerRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        socketTokenRef.current = null;
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
