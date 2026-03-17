import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Terminal } from "lucide-react";
import { useEffect, useRef } from "react";

export type PipelineLogEntry = {
  timestamp: string;
  level: string;
  message: string;
};

interface Props {
  pipelineStatus: string;
  pipelineLogs: PipelineLogEntry[];
  onClear?: () => void;
  isConnected?: boolean;
}

export const PipelineLog = ({
  pipelineStatus,
  pipelineLogs,
  onClear,
  isConnected,
}: Props) => {
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!logContainerRef.current) return;
    logContainerRef.current.scrollTo({
      top: logContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [pipelineLogs]);

  const handleDownloadLogs = () => {
    if (pipelineLogs.length === 0) return;
    const content = pipelineLogs
      .map((log) => `[${log.timestamp}] [${log.level}] ${log.message}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().replace(/[:.]/g, "-");
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `etl-logs-${date}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#4A90E2] bg-opacity-10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-[#4A90E2]" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Logs du Pipeline ETL</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Clock
                  className="w-3 h-3 text-[#4A5568] opacity-70"
                  aria-hidden="true"
                />
                <p className="text-xs text-[#4A5568] opacity-70">
                  {isConnected
                    ? "Connecté — logs en temps réel"
                    : "Connectez-vous et lancez un pipeline pour voir les logs"}
                </p>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              pipelineStatus === "success"
                ? "bg-[#5CC58C] bg-opacity-10 text-[#5CC58C] border-[#5CC58C]"
                : pipelineStatus === "running"
                  ? "bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]"
                  : pipelineStatus === "error"
                    ? "bg-[#FF887B] bg-opacity-10 text-[#FF887B] border-[#FF887B]"
                    : "bg-gray-100 text-gray-600 border-gray-300"
            }
          >
            {pipelineStatus === "success" && "✓ Succès"}
            {pipelineStatus === "running" && "⟳ En cours"}
            {pipelineStatus === "error" && "✗ Erreur"}
            {pipelineStatus === "idle" && "En attente"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={logContainerRef}
          className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm h-80 min-h-80 max-h-80 overflow-y-auto flex flex-col"
          role="log"
          aria-live="polite"
          aria-label="Journal du pipeline ETL"
        >
          {pipelineLogs.length === 0 ? (
            <p className="text-[#858585] text-sm flex-1 flex items-center justify-center">
              Aucun logs pour le moment
            </p>
          ) : (
            pipelineLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-3 py-1 hover:bg-white hover:bg-opacity-5 px-2 -mx-2 rounded"
              >
                <span className="text-[#858585] text-xs shrink-0 select-none">
                  {log.timestamp}
                </span>
                <span
                  className={`shrink-0 font-semibold text-xs ${
                    log.level === "INFO"
                      ? "text-[#4A90E2]"
                      : log.level === "SUCCESS"
                        ? "text-[#5CC58C]"
                        : log.level === "WARNING"
                          ? "text-[#FFB88C]"
                          : "text-[#FF887B]"
                  }`}
                >
                  [{log.level}]
                </span>
                <span className="text-[#d4d4d4] flex-1">{log.message}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-[#4A5568]">
            <span className="font-semibold">{pipelineLogs.length}</span> lignes
            de logs affichées
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 bg-white text-black hover:bg-slate-100 hover:text-black"
              onClick={handleDownloadLogs}
              disabled={pipelineLogs.length === 0}
            >
              Télécharger les logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 bg-white text-black hover:bg-slate-100 hover:text-black"
              onClick={() => onClear?.()}
              disabled={pipelineLogs.length === 0}
            >
              Effacer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
