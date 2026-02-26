import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Terminal } from "lucide-react";
import { PipelineLogType } from "./mocks";

interface Props {
    pipelineStatus: string
    pipelineLogs: PipelineLogType[]
}

export const PipelineLog = ({ pipelineStatus, pipelineLogs }: Props) => {
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
                  Dernier lancement : Aujourd&apos;hui à 14:32
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
        <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto">
          {pipelineLogs.map((log, index) => (
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
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-[#4A5568]">
            <span className="font-semibold">{pipelineLogs.length}</span> lignes
            de logs affichées
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Télécharger les logs
            </Button>
            <Button variant="outline" size="sm">
              Effacer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
